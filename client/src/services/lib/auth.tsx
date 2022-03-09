import { fetchClient } from 'services/api';
import { deepCloneMapper } from 'services/utils/deepCloneMapper';
import { processServiceCall } from 'services/utils/processServiceCall';

import { Endpoints } from 'services/lib/endpoints';

export const postCodeForOauthToken = (code: string): Promise<any> => {
  return processServiceCall(async () => {
    const apiResponse = await fetchClient
      .post(Endpoints.OauthToken, {
        json: { code },
      })
      .json<any>();
    return deepCloneMapper<any, any>(apiResponse, (from) => from);
  });
};
