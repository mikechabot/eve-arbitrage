import fetch from 'cross-fetch';
import jwksClient, { SigningKey } from 'jwks-rsa';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { EveBasicAuthKey } from 'src/constants';
import { Endpoints } from 'src/services/endpoints';

import { EveLoginService } from 'src/services/lib/eve-login-service';

import { JsonWebKeyRS256, OauthTokenApi, EveSsoMetadataApi } from 'src/services/types/oauth-api';

interface EveAuthServiceOpts {
  eveLoginService: EveLoginService;
}

export class EveAuthService {
  private readonly eveLoginService: EveLoginService;

  constructor({ eveLoginService }: EveAuthServiceOpts) {
    this.eveLoginService = eveLoginService;
  }

  /**
   * After an SSO login, the client sends up the code sent on the redirect URI,
   * which we use to fetch an OAuth2 token.
   * @param code
   */
  getOauthToken(code: string): Promise<OauthTokenApi> {
    return this.eveLoginService.fetch('v2/oauth/token', {
      method: 'POST',
      /**
       * EVE wants form encoded values
       */
      body: new URLSearchParams(`grant_type=authorization_code&code=${code}`),
      headers: {
        /**
         * Base64 encode our credentials: clientId + clientSecret
         */
        Authorization: `Basic ${Buffer.from(EveBasicAuthKey).toString('base64')}`,
        /**
         * Tell the server we're sending form encoded data
         */
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * Refresh the OAuth2 token given a refresh token
   * https://docs.esi.evetech.net/docs/sso/refreshing_access_tokens.html
   * @param refreshToken
   */
  refreshAuthToken(refreshToken: string): Promise<OauthTokenApi> {
    return this.eveLoginService.fetch('v2/oauth/token', {
      method: 'POST',
      /**
       * EVE wants form encoded values
       */
      body: new URLSearchParams(`grant_type=refresh_token&refresh_token=${refreshToken}`),
      headers: {
        /**
         * Base64 encode our credentials: clientId + clientSecret
         */
        Authorization: `Basic ${Buffer.from(EveBasicAuthKey).toString('base64')}`,
        /**
         * Tell the server we're sending form encoded data
         */
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async revokeAuthToken(refreshToken: string) {
    const revocationEndpoint = (await EveAuthService.fetchEveSsoMetadata(
      'revocation_endpoint',
    )) as string;

    return this.eveLoginService.fetch(revocationEndpoint, {
      method: 'POST',
      /**
       * EVE wants form encoded values
       */
      body: new URLSearchParams(`token_type_hint=refresh_token&token=${refreshToken}`),
      headers: {
        /**
         * Base64 encode our credentials: clientId + clientSecret
         */
        Authorization: `Basic ${Buffer.from(EveBasicAuthKey).toString('base64')}`,
        /**
         * Tell the server we're sending form encoded data
         */
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * Once we're given an OAuth2 token, Validate the JWT based against the EVE issuing server
   * https://docs.esi.evetech.net/docs/sso/validating_eve_jwt.html
   * @param oauthToken
   */
  async validateJwtAccessToken({ access_token }: OauthTokenApi): Promise<JwtPayload> {
    const jwksUri = (await EveAuthService.fetchEveSsoMetadata('jwks_uri')) as string;

    /**
     * Create the verification client
     */
    const client = jwksClient({ jwksUri });

    /**
     * This callback obtains the signing key from "jwksUri", which is used to
     * verifyAndRefreshOauthToken the OAuth token (issuer and expiry)
     * https://login.eveonline.com/oauth/jwks
     * @param header
     * @param callback
     */
    const getPublicKeyOrSecret = (header: JsonWebKeyRS256 | JwtPayload, callback: any) => {
      client.getSigningKey(header.kid, (e, key: SigningKey) => {
        /**
         * ts-ignore the below, but these properties do exist on SigningKey
         * Not sure why TS is complaining.
         */
        // @ts-ignore
        const signingKey = key.publicKey || key.rsaPublicKey;

        /**
         * Invoke the callback with the SigningKey
         */
        callback(e, signingKey);
      });
    };

    /**
     * Wrap the verification in a promise
     */
    return new Promise((resolve, reject) => {
      jwt.verify(
        access_token,
        getPublicKeyOrSecret,
        { issuer: 'login.eveonline.com' },
        (e, decoded: JwtPayload | string | undefined) => {
          if (e || !decoded) {
            reject(e);
          }
          resolve(decoded as JwtPayload);
        },
      );
    });
  }

  /**
   * Get SSO metadata from EVE, which contains the "jwks_uri" for token verification,
   * and "revocation_endpoint" for token invalidation
   * https://login.eveonline.com/.well-known/oauth-authorization-server
   */
  private static async fetchEveSsoMetadata(
    metadataKey?: keyof EveSsoMetadataApi,
  ): Promise<EveSsoMetadataApi | string> {
    /**
     * Fetch the JWKS verification endpoint from EVE
     */
    const metadataResponse = await fetch(Endpoints.SsoMetadata);

    const metadata: EveSsoMetadataApi = await metadataResponse.json();

    if (!metadataKey) {
      return metadata;
    }

    if (!metadata[metadataKey]) {
      throw new Error(`SSO metadata did not contain "${metadataKey}"`);
    }

    return metadata[metadataKey] as string;
  }
}
