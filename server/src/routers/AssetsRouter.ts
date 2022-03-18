import { NextFunction, Request, Response } from 'express';

import { BaseRouter } from 'src/routers/BaseRouter';

import { OauthTokenService } from 'src/services/lib/oauth-token-service';
import { EsiAssetService } from 'src/services/lib/esi-asset-service';

import {
  FetchMarketOrderResponse,
  FetchPaginatedCharacterAssetsResponse,
} from 'src/services/types/response-type-api';

interface AssetsRouterOpts {
  oauthTokenService: OauthTokenService;
  esiAssetService: EsiAssetService;
}

export class AssetsRouter extends BaseRouter {
  private readonly oauthTokenService: OauthTokenService;
  private readonly esiAssetService: EsiAssetService;

  constructor({ oauthTokenService, esiAssetService }: AssetsRouterOpts) {
    super();
    this.oauthTokenService = oauthTokenService;
    this.esiAssetService = esiAssetService;
  }

  initializeRoutes(): void {
    this.registerGetHandler('/character', this.fetchPaginatedCharacterAssets.bind(this));
    this.registerPostHandler('/orders', this.fetchOrder.bind(this));
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
      const assets = await this.esiAssetService.fetchAssets(access_token, characterId, page);

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

  async fetchOrder({ cookies, body }: Request, res: Response<FetchMarketOrderResponse>) {
    const jwt = await this.oauthTokenService.findJwtByCookie(cookies);
    if (!jwt) {
      res.status(401);
      res.json({ verified: false });
      return;
    }

    const { typeId } = body;
    const { access_token } = jwt;

    const order = await this.esiAssetService.fetchRawOrder(access_token, typeId);

    res.json({
      order,
      verified: true,
    });
  }
}
