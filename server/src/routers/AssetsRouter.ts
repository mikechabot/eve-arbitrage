import { NextFunction, Request, Response } from 'express';

import { BaseRouter, BaseRouterOpts } from 'src/routers/BaseRouter';
import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';
import { CharacterResponse } from 'src/services/types/character-api';

import {
  fetchEveCharacterDetails,
  fetchEveCharacterPortrait,
  fetchEveCharacter,
} from 'src/services/lib/assets';
import { OauthTokenApi } from 'src/services/types/auth-api';

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
    let jwt: OauthTokenApi | undefined;

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

    const character = await fetchEveCharacter(access_token);
    const characterDetails = await fetchEveCharacterDetails(access_token, character.CharacterID);
    const characterPortrait = await fetchEveCharacterPortrait(access_token, character.CharacterID);

    res.json({ verified: true, character, characterDetails, characterPortrait });
  }
}
