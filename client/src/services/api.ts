import ky, { HTTPError, Options } from 'ky';
import { AppEnv } from 'utils/appEnv';

export const fetchClient = ky.extend({
  retry: 0,
  prefixUrl: AppEnv.BaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { HTTPError };
export type APIOptions = Options;
