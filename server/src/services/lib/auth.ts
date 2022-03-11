import fetch from 'cross-fetch';
import jwksClient, { SigningKey } from 'jwks-rsa';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { EveBasicAuthKey } from 'src/constants';
import { Endpoints } from 'src/services/endpoints';

import { JsonWebKeyRS256, OauthToken, SsoMetadata } from 'src/services/types/auth';

export const fetchOauthToken = async (code: string): Promise<OauthToken> => {
  try {
    /**
     * Follow the token flow as defined in https://docs.esi.evetech.net/docs/sso/web_based_sso_flow.html
     */
    const oauthTokenResponse = await fetch(Endpoints.OauthToken, {
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
        /**
         * Required by EVE
         */
        Host: 'login.eveonline.com',
        /**
         * Tell fetch we're expecting JSON back
         */
        Accept: 'application/json',
      },
    });

    // Parse the JSON response
    return await oauthTokenResponse.json();
  } catch (e) {
    return e;
  }
};

/**
 * Validate the JWT based on the instructions from EVE
 * https://docs.esi.evetech.net/docs/sso/validating_eve_jwt.html
 * @param oauthToken
 */
export const validateJwt = async (oauthToken: OauthToken): Promise<JwtPayload | undefined> => {
  let jwksUri: string;

  try {
    /**
     * Fetch the JWKS verification endpoint from EVE
     */
    const metadataResponse = await fetch(Endpoints.SsoMetadata);

    /**
     * Get SSO metadata from EVE, which contains the "jwks_uri"
     * https://login.eveonline.com/oauth/jwks
     */
    const metadata: SsoMetadata = await metadataResponse.json();
    if (!metadata.jwks_uri) {
      return undefined;
    }

    /**
     * Set the "jwksUri" for JWT verification
     */
    jwksUri = metadata.jwks_uri;
  } catch (e) {
    throw e;
  }

  /**
   * Create the verification client
   */
  const client = jwksClient({ jwksUri });

  /**
   * This callback obtains the signing key from "jwksUri", which is used to
   * verify the OAuth token (issuer and expiry)
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
      oauthToken.access_token,
      getPublicKeyOrSecret,
      { issuer: Endpoints.OauthIssuer },
      (e, decoded: JwtPayload | string | undefined) => {
        if (e || !decoded) {
          reject(e);
        }
        resolve(decoded as JwtPayload);
      },
    );
  });
};
