import { fetchClient } from 'services/api';
import { deepCloneMapper } from 'services/utils/deepCloneMapper';
import { processServiceCall } from 'services/utils/processServiceCall';

import { Endpoints } from 'services/lib/endpoints';
import { AuthTokenResponse, AuthVerifyResponse } from '../types/auth-api';

export const postCodeForOauthToken = (code: string): Promise<AuthTokenResponse> => {
  return processServiceCall(async () => {
    const apiResponse = await fetchClient
      .post(Endpoints.OauthToken, {
        json: { code },
      })
      .json<AuthTokenResponse>();

    return deepCloneMapper<AuthTokenResponse, AuthTokenResponse>(apiResponse, (from) => from);
  });
};

export const fetchVerifyOrRefreshOauth = (): Promise<AuthVerifyResponse> => {
  return processServiceCall(async () => {
    const apiResponse = await fetchClient.get(Endpoints.OauthVerify).json<AuthVerifyResponse>();
    return deepCloneMapper<AuthVerifyResponse, AuthVerifyResponse>(apiResponse, (from) => from);
  });
};
