import { NextFunction, Request, Response } from 'express';

import { BaseRouter } from 'src/routers/BaseRouter';

import { OauthTokenService } from 'src/services/lib/oauth-token-service';
import { EsiCharacterService } from 'src/services/lib/esi-character-service';
import { EsiCorporationService } from 'src/services/lib/esi-corporation-service';

import { FetchCharacterDetailsResponse } from 'src/services/types/response-type-api';

interface AssetsRouterOpts {
  oauthTokenService: OauthTokenService;
  esiCharacterService: EsiCharacterService;
  esiCorporationService: EsiCorporationService;
}

export class CharacterRouter extends BaseRouter {
  private readonly oauthTokenService: OauthTokenService;
  private readonly esiCharacterService: EsiCharacterService;
  private readonly esiCorporationService: EsiCorporationService;

  constructor({ oauthTokenService, esiCharacterService, esiCorporationService }: AssetsRouterOpts) {
    super();
    this.oauthTokenService = oauthTokenService;
    this.esiCharacterService = esiCharacterService;
    this.esiCorporationService = esiCorporationService;
  }

  initializeRoutes(): void {
    this.registerGetHandler('*', this.fetchCharacterDetails.bind(this));
  }

  /**
   * Get various character information
   * @param cookies
   * @param body
   * @param res
   * @param next
   */
  async fetchCharacterDetails(
    { cookies }: Request,
    res: Response<FetchCharacterDetailsResponse>,
    next: NextFunction,
  ) {
    const jwt = await this.oauthTokenService.findJwtByCookie(cookies);
    if (!jwt) {
      res.status(401);
      res.json({ verified: false });
      return;
    }

    const { access_token, characterId } = jwt;

    try {
      const [details, portrait, wallet] = await Promise.all([
        this.esiCharacterService.fetchDetails(access_token, characterId),
        this.esiCharacterService.fetchPortrait(access_token, characterId),
        this.esiCharacterService.fetchWallet(access_token, characterId),
      ]);

      const corporation = await this.esiCorporationService.fetchDetails(
        access_token,
        details.corporation_id,
      );

      const response: FetchCharacterDetailsResponse = {
        corporation,
        character: {
          details,
          portrait,
          wallet,
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
