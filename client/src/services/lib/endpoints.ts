import urlJoin from 'url-join';
import { generatePath as internalGeneratePath, ExtractRouteParams } from 'react-router';

import { AppEnv } from 'utils/appEnv';

export const Endpoints = {
  User: urlJoin(AppEnv.BaseApiUrl, '/assets/user'),
  Corporation: urlJoin(AppEnv.BaseApiUrl, '/assets/corporation'),
  OauthToken: urlJoin(AppEnv.BaseApiUrl, '/auth/token'),
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Endpoints = typeof Endpoints[keyof typeof Endpoints];

export function buildEndpoint<T extends string = Endpoints>(
  path: T,
  params?: ExtractRouteParams<T>,
) {
  return internalGeneratePath<T>(path, params);
}
