import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

import { InvType } from 'src/entities/InvType';

import {
  fetchEveCharacterDetails,
  fetchEveCharacterPortrait,
  fetchEveCharacterCorporation,
  fetchEveCharacterWallet,
  fetchEvePaginatedCharacterAssets,
} from 'src/services/lib/assets';

import { AuthToken } from 'src/entities/AuthToken';
import { BaseRouter, BaseRouterOpts } from 'src/routers/BaseRouter';

import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';
import { StationRepository } from 'src/repositories/StationRepository';

import { CharacterResponse, PaginatedCharacterAssets } from 'src/services/types/character-api';
import { Station } from 'src/entities/Station';

interface AssetsRouterOpts extends BaseRouterOpts {
  authRepository: AuthTokenRepository;
  itemsRepository: Repository<InvType>;
  stationRepository: StationRepository;
}

export class AssetsRouter extends BaseRouter {
  private readonly authRepository: AuthTokenRepository;
  private readonly itemsRepository: Repository<InvType>;
  private readonly stationRepository: StationRepository;

  constructor(opts: AssetsRouterOpts) {
    super(opts);
    this.authRepository = opts.authRepository;
    this.itemsRepository = opts.itemsRepository;
    this.stationRepository = opts.stationRepository;
  }

  initializeRoutes(): void {
    this.registerGetHandler('/character', this.getCharacter.bind(this));
  }

  /**
   * Get various character information
   * @param cookies
   * @param body
   * @param res
   * @param next
   */
  async getCharacter(
    { cookies, body }: Request,
    res: Response<CharacterResponse>,
    next: NextFunction,
  ) {
    let jwt: AuthToken | undefined;

    if (!cookies?.jwt) {
      next(new Error('Unable to authorize character request'));
      return;
    }

    jwt = await this.authRepository.getTokenByJwt(cookies.jwt);
    if (!jwt) {
      res.status(401);
      res.json({ verified: false });
      return;
    }

    const { page = 1 } = body;
    const { access_token, characterId } = jwt;

    const details = await fetchEveCharacterDetails(access_token, characterId);
    const portrait = await fetchEveCharacterPortrait(access_token, characterId);
    const wallet = await fetchEveCharacterWallet(access_token, characterId);
    const characterAssets = await this.getCharacterInventory(access_token, characterId, page);
    const corporationDetails = await fetchEveCharacterCorporation(
      access_token,
      details.corporation_id,
    );

    const response: CharacterResponse = {
      character: {
        details,
        portrait,
        wallet,
        assets: characterAssets,
      },
      corporation: {
        details: corporationDetails,
      },
      verified: true,
    };

    res.json(response);
  }

  /**
   * Get character inventory
   * @param accessToken
   * @param characterId
   * @param page
   */
  async getCharacterInventory(
    accessToken: string,
    characterId: number,
    page: number,
  ): Promise<PaginatedCharacterAssets> {
    const inventory = await fetchEvePaginatedCharacterAssets(accessToken, characterId, page);
    const itemTypes = await this.itemsRepository.find({});
    const stations = await this.stationRepository.findAll();

    const itemTypeMap = {} as Record<number, InvType>;
    itemTypes.forEach((itemType) => {
      itemTypeMap[itemType.typeId] = itemType;
    });

    const stationMap = {} as Record<number, Station>;
    stations!.forEach((station) => {
      stationMap[station.stationId] = station;
    });

    let nextPage = -1;
    if (inventory.length >= 1000) {
      nextPage = page + 1;
    }

    inventory.forEach((asset) => {
      if (itemTypeMap[asset.type_id]) {
        asset.typeName = itemTypeMap[asset.type_id].typeName;
      }
      if (stationMap[asset.location_id]) {
        asset.stationName = stationMap[asset.location_id].stationName;
      }
    });

    return {
      nextPage,
      inventory,
    };
  }
}
