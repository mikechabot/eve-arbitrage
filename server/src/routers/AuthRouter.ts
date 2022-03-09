import { Router } from 'express';
import fetch from 'cross-fetch';

import { EveClientId, EveClientSecret, EveTokenUrl } from '../constants';

export const AuthRouter = Router();

AuthRouter.get('/token', async (req, res) => {
  const { code } = req.body;

  /**
   * If EVE SSO didn't give us a code, just return.
   */
  if (!code) {
    res.send('Unable to get auth code from EVE SSO.');
    return;
  }

  const authKey = `${EveClientId}:${EveClientSecret}`;

  try {
    /**
     * Follow the token flow as defined in https://docs.esi.evetech.net/docs/sso/web_based_sso_flow.html
     */
    const tokenResponse = await fetch(EveTokenUrl, {
      method: 'POST',
      /**
       * EVE wants form encoded values
       */
      body: new URLSearchParams(`grant_type=authorization_code&code=${code}`),
      headers: {
        /**
         * Base64 encode our credentials: clientId + clientSecret
         */
        Authorization: `Basic ${Buffer.from(authKey).toString('base64')}`,
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
    const content = await tokenResponse.json();
    res.json(content);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(`Error fetching auth token from ${EveTokenUrl}`);
  }
});

AuthRouter.get('/success', (_, res) => {
  res.send('Success');
});
