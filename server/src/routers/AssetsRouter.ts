import { NextFunction, Request, Response } from 'express';

import { BaseRouter } from 'src/routers/BaseRouter';

import { AuthTokenService } from 'src/services/lib/auth-token-service';
import { CharacterResponse } from 'src/services/types/character-api';
import { EsiCharacterService } from 'src/services/lib/esi-character-service';
import { EsiCorporationService } from 'src/services/lib/esi-corporation-service';

interface AssetsRouterOpts {
  authTokenService: AuthTokenService;
  esiCharacterService: EsiCharacterService;
  esiCorporationService: EsiCorporationService;
}

export class AssetsRouter extends BaseRouter {
  private readonly authTokenService: AuthTokenService;
  private readonly esiCharacterService: EsiCharacterService;
  private readonly esiCorporationService: EsiCorporationService;

  constructor({ authTokenService, esiCharacterService, esiCorporationService }: AssetsRouterOpts) {
    super();
    this.authTokenService = authTokenService;
    this.esiCharacterService = esiCharacterService;
    this.esiCorporationService = esiCorporationService;
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
    const jwt = await this.authTokenService.findJwtByCookie(cookies);
    if (!jwt) {
      res.status(401);
      res.json({ verified: false });
      return;
    }

    const { page = 1 } = body;
    const { access_token, characterId } = jwt;

    try {
      const details = await this.esiCharacterService.fetchDetails(access_token, characterId);
      const portrait = await this.esiCharacterService.fetchPortrait(access_token, characterId);
      const wallet = await this.esiCharacterService.fetchWallet(access_token, characterId);
      const characterAssets = await this.esiCharacterService.fetchAssets(
        access_token,
        characterId,
        page,
      );

      const corporationDetails = await this.esiCorporationService.fetchDetails(
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
    } catch (e) {
      res.status(500);
      next(e);
    }
  }
}
