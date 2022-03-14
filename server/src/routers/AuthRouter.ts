import { Request, Response } from 'express';

import { BaseRouter } from 'src/routers/BaseRouter';

import { EveAuthService } from 'src/services/lib/eve-auth-service';
import { AuthTokenService } from 'src/services/lib/auth-token-service';
import { EveCharacterService } from 'src/services/lib/eve-character-service';

import { AuthTokenResponse, AuthVerifyResponse, ChallengeType } from 'src/routers/types/auth-api';

interface AuthRouterProps {
  authTokenService: AuthTokenService;
  eveAuthService: EveAuthService;
  eveCharacterService: EveCharacterService;
}

export class AuthRouter extends BaseRouter {
  private readonly authTokenService: AuthTokenService;
  private readonly eveAuthService: EveAuthService;
  private readonly eveCharacterService: EveCharacterService;

  constructor({ eveAuthService, authTokenService, eveCharacterService }: AuthRouterProps) {
    super();
    this.eveAuthService = eveAuthService;
    this.authTokenService = authTokenService;
    this.eveCharacterService = eveCharacterService;
  }

  initializeRoutes(): void {
    this.registerPostHandler('/login', this.login.bind(this));
    this.registerPostHandler('/logout', this.logout.bind(this));
    this.registerGetHandler('/verify', this.getVerifyToken.bind(this));
  }

  /**
   * Verify the existing OAuth2 token. If it's no longer valid, attempt to refresh it.
   * Always send back an HTTP 200 OK response. If for whatever reason we cannot obtain
   * an OAuth token, and back and SSO challenge.
   * @param cookies
   * @param res
   */
  async getVerifyToken({ cookies }: Request, res: Response<AuthVerifyResponse>) {
    /**
     * If the JWT cookie on the cookie is not in the database, this is
     * probably a bad actor, so send back the SSO challenge.
     */
    const oauthToken = await this.authTokenService.findJwtByCookie(cookies);
    if (!oauthToken) {
      res.json({ verified: false, challenge: ChallengeType.SSO });
      return;
    }

    try {
      /**
       * Validate the existing token we found
       */
      await this.eveAuthService.validateJwtAccessToken(oauthToken);
      res.json({ verified: true });
      return;
    } catch (e) {
      try {
        console.log(`Invalidating token..."${oauthToken}"`);
        await this.authTokenService.invalidateToken(oauthToken);
        console.log(`Refreshing token..."${oauthToken.refresh_token}`);
        const newOauthToken = await this.eveAuthService.refreshAuthToken(oauthToken.refresh_token);
        console.log(`Got refreshed token "${newOauthToken}"`);
        await this.eveAuthService.validateJwtAccessToken(newOauthToken);
        const character = await this.eveCharacterService.fetchCharacter(newOauthToken.access_token);
        await this.authTokenService.addToken(newOauthToken, character.CharacterID);

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
  async login(req: Request, res: Response<AuthTokenResponse>) {
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
      const oauthToken = await this.eveAuthService.getOauthToken(code);

      /**
       * Validate the OAuth token
       */
      await this.eveAuthService.validateJwtAccessToken(oauthToken);
      const character = await this.eveCharacterService.fetchCharacter(oauthToken.access_token);
      await this.authTokenService.addToken(oauthToken, character.CharacterID);

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

  /**
   * If the logout button is clicked, have the Eve servers revoke
   * the refresh token and invalidate the token in our database.
   * @param cookies
   * @param res
   */
  async logout({ cookies }: Request, res: Response<AuthVerifyResponse>) {
    const oauthToken = await this.authTokenService.findJwtByCookie(cookies);
    if (!oauthToken) {
      res.status(401);
      res.json({ verified: false, challenge: ChallengeType.SSO });
      return;
    }

    try {
      await this.eveAuthService.revokeAuthToken(oauthToken.refresh_token);
      await this.authTokenService.invalidateToken(oauthToken);

      res.cookie('jwt', {
        secure: true,
        httpOnly: true,
        domain: 'localhost',
        maxAge: 0,
        expires: new Date(0),
      });

      res.status(200);
      res.json({ verified: false, challenge: ChallengeType.SSO });
    } catch (e) {
      console.error(e);
      res.status(401);
      res.json({ verified: false, challenge: ChallengeType.SSO });
    }
  }
}
