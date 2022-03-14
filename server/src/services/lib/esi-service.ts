import fetch from 'cross-fetch';
import { Endpoints } from 'src/services/endpoints';

export class EsiService {
  async fetch<T>(accessToken: string, endpointUrl: string): Promise<T> {
    try {
      const data = await fetch(`${Endpoints.EsiEveTech}/${endpointUrl}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          /**
           * Required by ESI
           */
          Host: 'esi.evetech.net',
          /**
           * Tell fetch we're expecting JSON back
           */
          Accept: 'application/json',
        },
      });
      return await data.json();
    } catch (e) {
      console.error(`Error fetching data from ESI at ${endpointUrl}`);
      return e;
    }
  }
}
