import { Request, Response } from 'express';

import { Endpoints } from 'src/services/endpoints';

import { fetchOauthToken, validateJwt } from 'src/services/lib/auth';

import { BaseRouter, BaseRouterOpts } from 'src/routers/BaseRouter';
import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';
import { AuthVerifyResponse, ChallengeType } from 'src/routers/types/auth-api';

interface AuthRouterProps extends BaseRouterOpts {
  repository: AuthTokenRepository;
}

export class AuthRouter extends BaseRouter {
  private readonly repository: AuthTokenRepository;

  constructor(opts: AuthRouterProps) {
    super(opts);
    this.repository = opts.repository;
  }

  initializeRoutes(): void {
    this.registerPostHandler('/token', this.postToken.bind(this));
    this.registerGetHandler('/verify', this.verifyJwtCookie.bind(this));
  }

  async verifyJwtCookie({ cookies }: Request, res: Response<AuthVerifyResponse>) {
    if (cookies?.jwt) {
      const jwt = await this.repository.getTokenByJwt(cookies.jwt);
      if (jwt) {
        res.json({ verified: true });
        return;
      }
    }
    /**
     * This is still an HTTP 200 OK, as we want to send the SSO challenge
     */
    res.json({ verified: false, challenge: ChallengeType.SSO });
  }

  async postToken(req: Request, res: Response) {
    const { code } = req.body;

    /**
     * If EVE SSO didn't give us a remoteCode, just return.
     */
    if (!code) {
      res.status(401);
      res.send('You have not authorized against EVE SSO');
      return;
    }

    try {
      /**
       * Get the OAuth token
       */
      const oauthToken = await fetchOauthToken(code);

      console.log(oauthToken);

      /**
       * Validate the OAuth token
       */
      await validateJwt(oauthToken);

      await this.repository.insertToken(oauthToken);

      res.cookie('jwt', oauthToken.access_token, {
        secure: true,
        httpOnly: true,
        domain: 'localhost',
        maxAge: 365 * 24 * 60 * 60 * 1000, // Keep cookie for a year
      });

      res.json({ success: true });

      /**
       * Get character information
       */
      // const character = await verifyJwtAndGetCharacter(oauthToken.access_token);
      //
      // res.json(character);
    } catch (e) {
      console.error(e);
      res.status(401);
      res.send(`Error fetching auth token from ${Endpoints.OauthToken}`);
    }
  }
}
