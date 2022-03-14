export const __prod__ = process.env.NODE_ENV === 'production';

export const StreamEvent = {
  Error: 'error',
  Data: 'data',
};

export const CsvFilename = {
  Category: 'invCategories.csv',
  Group: 'invGroups.csv',
  Type: 'invTypes.csv',
  Station: 'stations.csv',
};

export const EveClientId = '74d942ff87ee40e281482ce420e376d7';
export const EveClientSecret = 'PGha8mnt29efXthcIE4DZFcNikInUCSomf42FO8n';
export const EveBasicAuthKey = `${EveClientId}:${EveClientSecret}`;

/**
 * Eve supports "RS-256", but we need to remove the dash, since the keys
 * response that is returned looks liked:
 *
 *    {
 *      ...
 *      alg: "RS256"
 *      ...
 *    }
 *
 * https://docs.esi.evetech.net/docs/sso/validating_eve_jwt.html
 *
 */
export const SupportedAuthAlg = 'RS256';
