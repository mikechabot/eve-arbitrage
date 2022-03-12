import { EveBasicAuthKey } from 'src/constants';

export const DefaultAuthHeaders = {
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
};

