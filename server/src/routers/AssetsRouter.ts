import { NextFunction, Request, Response } from 'express';

import { BaseRouter } from 'src/routers/BaseRouter';

import { OauthTokenService } from 'src/services/lib/oauth-token-service';
import { EsiCharacterService } from 'src/services/lib/esi-character-service';

import { FetchPaginatedCharacterAssetsResponse } from 'src/services/types/response-type-api';

interface AssetsRouterOpts {
  oauthTokenService: OauthTokenService;
  esiCharacterService: EsiCharacterService;
}

export class AssetsRouter extends BaseRouter {
  private readonly oauthTokenService: OauthTokenService;
  private readonly esiCharacterService: EsiCharacterService;

  constructor({ oauthTokenService, esiCharacterService }: AssetsRouterOpts) {
    super();
    this.oauthTokenService = oauthTokenService;
    this.esiCharacterService = esiCharacterService;
  }

  initializeRoutes(): void {
    this.registerGetHandler('/character', this.fetchPaginatedCharacterAssets.bind(this));
  }

  /**
   * Get various character information
   * @param cookies
   * @param body
   * @param res
   * @param next
   */
  async fetchPaginatedCharacterAssets(
    { cookies, body }: Request,
    res: Response<FetchPaginatedCharacterAssetsResponse>,
    next: NextFunction,
  ) {
    const jwt = await this.oauthTokenService.findJwtByCookie(cookies);
    if (!jwt) {
      res.status(401);
      res.json({ verified: false });
      return;
    }

    const { page = 1 } = body;
    const { access_token, characterId } = jwt;

    try {
      const assets = await this.esiCharacterService.fetchAssets(access_token, characterId, page);

      const response = {
        ...assets,
        verified: true,
      };

      res.json(response);
    } catch (e) {
      res.status(500);
      next(e);
    }
  }
}
