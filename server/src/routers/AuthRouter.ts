import { Request, Response } from 'express';

import { fetchOauthToken, refreshOauthToken, validateJwtAccessToken } from 'src/services/lib/auth';

import { BaseRouter, BaseRouterOpts } from 'src/routers/BaseRouter';
import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';
import { AuthTokenResponse, AuthVerifyResponse, ChallengeType } from 'src/routers/types/auth-api';
import { AuthToken } from 'src/entities/AuthToken';
import { fetchEveCharacter } from 'src/services/lib/assets';

interface AuthRouterProps extends BaseRouterOpts {
  authRepository: AuthTokenRepository;
}

export class AuthRouter extends BaseRouter {
  private readonly authRepository: AuthTokenRepository;

  constructor(opts: AuthRouterProps) {
    super(opts);
    this.authRepository = opts.authRepository;
  }

  initializeRoutes(): void {
    this.registerPostHandler('/token', this.obtainOauthToken.bind(this));
    this.registerGetHandler('/verify', this.verifyAndRefreshOauthToken.bind(this));
  }

  /**
   * Verify the existing OAuth2 token. If it's no longer valid, attempt to refresh it.
   * Always send back an HTTP 200 OK response. If for whatever reason we cannot obtain
   * an OAuth token, and back and SSO challenge.
   * @param cookies
   * @param res
   */
  async verifyAndRefreshOauthToken({ cookies }: Request, res: Response<AuthVerifyResponse>) {
    /**
     * If the request doesn't contain the JWT cookie we set, then
     * send back the SSO challenge
     */
    if (!cookies?.jwt) {
      console.log('No Cookie');
      res.json({ verified: false, challenge: ChallengeType.SSO });
      return;
    }

    let oauthToken: AuthToken | undefined;

    /**
     * If the JWT cookie on the cookie is not in the database, this is
     * probably a bad actor, so send back the SSO challenge.
     */
    oauthToken = await this.authRepository.getTokenByJwt(cookies.jwt);
    if (!oauthToken) {
      console.log('No oauthtoken in db');
      res.json({ verified: false, challenge: ChallengeType.SSO });
      return;
    }

    try {
      /**
       * Validate the existing token we found
       */
      await validateJwtAccessToken(oauthToken);
      res.json({ verified: true });
      return;
    } catch (e) {
      try {
        console.log(`Invalidating token..."${oauthToken}"`);
        await this.authRepository.invalidateToken(oauthToken);
        console.log(`Refreshing token..."${oauthToken.refresh_token}`);
        const newOauthToken = await refreshOauthToken(oauthToken.refresh_token);
        console.log(`Got refreshed token "${newOauthToken}"`);
        await validateJwtAccessToken(newOauthToken);
        const character = await fetchEveCharacter(newOauthToken.access_token);
        await this.authRepository.insertToken(newOauthToken, character.CharacterID);

        res.cookie('jwt', newOauthToken.access_token, {
          secure: true,
          httpOnly: true,
          domain: 'localhost',
          maxAge: 365 * 24 * 60 * 60 * 1000, // Keep cookie for a year
        });

        res.json({ verified: true });
        return;
      } catch (e) {
        console.log('Unable to refresh OAuth token');
        console.error(e);
      }
    }

    // Kill the cookie
    // res.cookie('jwt', {
    //   secure: true,
    //   httpOnly: true,
    //   domain: 'localhost',
    //   maxAge: 0,
    //   expires: new Date(0),
    // });

    // TODO: REMOVE THIS, BUT USED TO DEBUG
    // res.json({ verified: true });

    /**
     * If we get here, we could validate and/or refresh the token.
     */
    res.json({ verified: false, challenge: ChallengeType.SSO });
  }

  /**
   * After an SSO login, the client sends up the code sent on the redirect URI,
   * which we use to fetch an OAuth2 token.
   * @param req
   * @param res
   */
  async obtainOauthToken(req: Request, res: Response<AuthTokenResponse>) {
    const { code } = req.body;

    /**
     * If EVE SSO didn't give us a remoteCode, just return.
     */
    if (!code) {
      res.status(401);
      res.json({ verified: false });
      return;
    }

    try {
      /**
       * Get the OAuth token
       */
      const oauthToken = await fetchOauthToken(code);

      /**
       * Validate the OAuth token
       */
      await validateJwtAccessToken(oauthToken);
      const character = await fetchEveCharacter(oauthToken.access_token);
      await this.authRepository.insertToken(oauthToken, character.CharacterID);

      /**
       * Set a secure HTTP-only cookie on the response
       */
      res.cookie('jwt', oauthToken.access_token, {
        secure: true,
        httpOnly: true,
        domain: 'localhost',
        maxAge: 365 * 24 * 60 * 60 * 1000, // Keep cookie for a year
      });

      res.json({ verified: true });
    } catch (e) {
      console.error(e);
      res.status(401);
      res.json({ verified: false });
    }
  }
}
