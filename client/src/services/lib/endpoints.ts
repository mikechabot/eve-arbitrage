import urlJoin from 'url-join';
import { generatePath as internalGeneratePath, ExtractRouteParams } from 'react-router';

import { AppEnv } from 'utils/appEnv';

export const Endpoints = {
  Character: urlJoin(AppEnv.BaseApiUrl, '/assets/character'),
  Corporation: urlJoin(AppEnv.BaseApiUrl, '/assets/corporation'),
  OauthToken: urlJoin(AppEnv.BaseApiUrl, '/auth/token'),
  OauthVerify: urlJoin(AppEnv.BaseApiUrl, '/auth/verify'),
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Endpoints = typeof Endpoints[keyof typeof Endpoints];

export function buildEndpoint<T extends string = Endpoints>(
  path: T,
  params?: ExtractRouteParams<T>,
) {
  return internalGeneratePath<T>(path, params);
}
