import { NextFunction, Request, Response } from 'express';

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
import { CharacterResponse, PaginatedCharacterAssets } from 'src/services/types/character-api';

interface AssetsRouterOpts extends BaseRouterOpts {
  repository: AuthTokenRepository;
}

export class AssetsRouter extends BaseRouter {
  private readonly repository: AuthTokenRepository;

  constructor(opts: AssetsRouterOpts) {
    super(opts);
    this.repository = opts.repository;
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

    jwt = await this.repository.getTokenByJwt(cookies.jwt);
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

    let nextPage = -1;
    if (inventory.length >= 1000) {
      nextPage = page + 1;
    }

    return {
      nextPage,
      inventory,
    };
  }
}
