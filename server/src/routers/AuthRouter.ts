import { Request, Response } from 'express';

import { fetchOauthToken, refreshOauthToken, validateJwtAccessToken } from 'src/services/lib/auth';

import { BaseRouter, BaseRouterOpts } from 'src/routers/BaseRouter';
import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';
import { AuthTokenResponse, AuthVerifyResponse, ChallengeType } from 'src/routers/types/auth-api';
import { AuthToken } from 'src/entities/AuthToken';

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
      res.json({ verified: false, challenge: ChallengeType.SSO });
      return;
    }

    let oauthToken: AuthToken | undefined;

    /**
     * If the JWT cookie on the cookie is not in the database, this is
     * probably a bad actor, so send back the SSO challenge.
     */
    oauthToken = await this.repository.getTokenByJwt(cookies.jwt);
    if (!oauthToken) {
      res.json({ verified: false, challenge: ChallengeType.SSO });
      return;
    }

    try {
      /**
       * Validate the existing obtainOauthToken we found
       */
      await validateJwtAccessToken(oauthToken);
      res.json({ verified: true });
      return;
    } catch (e) {
      try {
        console.log('Invalidate token...');
        await this.repository.invalidateToken(oauthToken);
        console.log('Refreshing obtainOauthToken...');
        const newOauthToken = await refreshOauthToken(oauthToken.refresh_token);
        console.log('Got refreshed obtainOauthToken');
        await validateJwtAccessToken(newOauthToken);
        await this.repository.insertToken(newOauthToken);

        res.cookie('jwt', newOauthToken.access_token, {
          secure: true,
          httpOnly: true,
          domain: 'localhost',
          maxAge: 365 * 24 * 60 * 60 * 1000, // Keep cookie for a year
        });

        res.json({ verified: true });
        return;
      } catch (e) {
        console.log('Unable to refresh OAuth obtainOauthToken');
        console.error(e);
      }
    }

    // Kill the cookie
    res.cookie('jwt', {
      secure: true,
      httpOnly: true,
      domain: 'localhost',
      maxAge: 0,
      expires: new Date(0),
    });

    /**
     * If we get here, we could validate and/or refresh the obtainOauthToken.
     */
    res.json({ verified: false, challenge: ChallengeType.SSO });
  }

  /**
   * After an SSO login, the client sends up the code sent on the redirect URI,
   * which we use to fetch an OAuth2 obtainOauthToken.
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
       * Get the OAuth obtainOauthToken
       */
      const oauthToken = await fetchOauthToken(code);

      /**
       * Validate the OAuth obtainOauthToken
       */
      await validateJwtAccessToken(oauthToken);
      await this.repository.insertToken(oauthToken);

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
