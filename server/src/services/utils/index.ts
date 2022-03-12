/**
 * Whenever fetching from an EveTech resource, we require these headers.
 * @param accessToken
 */
export const buildDefaultEveTechHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  /**
   * Required by EVE
   */
  Host: 'login.eveonline.com',
  /**
   * Tell fetch we're expecting JSON back
   */
  Accept: 'application/json',
});

/**
 * When we fetch the CharacterApi from EveAuth, we require these headers.
 * These headers are NOT used for EveTech endpoints.
 * @param accessToken
 */
export const buildDefaultEveAuthVerifyHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  /**
   * Required by EVE
   */
  Host: 'login.eveonline.com',
  /**
   * Tell fetch we're expecting JSON back
   */
  Accept: 'application/json',
});
