import fetch from 'cross-fetch';

import { Endpoints } from 'src/services/endpoints';

export class EveLoginService {
  /**
   * If the endpoint URL is a full URL (i.e. starts with "https), then
   * use it, otherwise append it to "https://login.eveonline.com"
   * @param endpointUrl
   * @param options
   */
  async fetch<T>(endpointUrl: string, options: RequestInit = {}): Promise<T> {
    const { method = 'GET', body, headers } = options;

    let url = endpointUrl;
    if (!endpointUrl.startsWith('https')) {
      url = `${Endpoints.EveLoginOnline}/${endpointUrl}`;
    }

    try {
      const data = await fetch(url, {
        body,
        method,
        headers: {
          /**
           * Required by EVE
           */
          Host: 'login.eveonline.com',
          /**
           * Tell fetch we're expecting JSON back
           */
          Accept: 'application/json',
          /**
           * Append additional attributes
           */
          ...headers,
        },
      });
      return await data.json();
    } catch (e) {
      console.error(`Unable to fetch from EveLogin: ${url}`);
      return e;
    }
  }
}
