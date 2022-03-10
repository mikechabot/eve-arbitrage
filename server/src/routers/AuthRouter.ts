import { Router } from 'express';

import { Endpoints } from 'src/services/endpoints';

import {
  fetchEveJwt,
  validateJwt,
  verifyOauthAccessTokenAndGetCharacter,
  // fetchJsonWebKey,
  // verifyOauthAccessTokenAndGetCharacter,
} from 'src/services/lib/auth';

// import { EveBasicAuthKey } from 'src/constants';

export const AuthRouter = Router();

AuthRouter.post('/token', async (req, res) => {
  const { code } = req.body;

  /**
   * If EVE SSO didn't give us a code, just return.
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
    const jwt = await fetchEveJwt(code);

    /**
     * Validate the OAuth token
     */
    await validateJwt(jwt);

    /**
     * Get character information
     */
    const character = await verifyOauthAccessTokenAndGetCharacter(jwt.access_token);

    res.json(character);
  } catch (e) {
    console.error(e);
    res.status(401);
    res.send(`Error fetching auth token from ${Endpoints.OauthToken}`);
  }
});
