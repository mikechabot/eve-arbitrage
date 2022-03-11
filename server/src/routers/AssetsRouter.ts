import { NextFunction, Request, Response } from 'express';

import { BaseRouter, BaseRouterOpts } from 'src/routers/BaseRouter';
import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';
import { CharacterResponse } from 'src/services/types/character';

import {
  fetchCharacterDetails,
  fetchCharacterPortrait,
  verifyJwtAndGetCharacter,
} from 'src/services/lib/assets';
import { OauthToken } from 'src/services/types/auth';

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

  async getCharacter({ cookies }: Request, res: Response<CharacterResponse>, next: NextFunction) {
    let jwt: OauthToken | undefined;

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

    const { access_token } = jwt;

    const character = await verifyJwtAndGetCharacter(access_token);
    const characterDetails = await fetchCharacterDetails(access_token, character.CharacterID);
    const characterPortrait = await fetchCharacterPortrait(access_token, character.CharacterID);

    res.json({ verified: true, character, characterDetails, characterPortrait });
  }
}
