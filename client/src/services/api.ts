import ky, { HTTPError, Options } from 'ky';

export const fetchClient = ky.extend({
  retry: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { HTTPError };
export type APIOptions = Options;
