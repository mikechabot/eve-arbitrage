import { fetchClient } from 'services/api';
import { deepCloneMapper } from 'services/utils/deepCloneMapper';
import { processServiceCall } from 'services/utils/processServiceCall';

import { Endpoints } from 'services/lib/endpoints';
import { AuthTokenResponse, AuthVerifyResponse } from '../types/auth-api';

/**
 * Post the code we got back from the SSO login redirect to obtain the OAuth token.
 * @param code
 */
export const postLogin = (code: string): Promise<AuthTokenResponse> => {
  return processServiceCall(async () => {
    const apiResponse = await fetchClient
      .post(Endpoints.OauthTokenLogin, {
        json: { code },
      })
      .json<AuthTokenResponse>();

    return deepCloneMapper<AuthTokenResponse, AuthTokenResponse>(apiResponse, (from) => from);
  });
};

/**
 * Log out from the system. Revoke and invalidate the OAuth token.
 */
export const postLogout = (): Promise<AuthVerifyResponse> => {
  return processServiceCall(async () => {
    const apiResponse = await fetchClient
      .post(Endpoints.OauthTokenLogout)
      .json<AuthVerifyResponse>();
    return deepCloneMapper<AuthVerifyResponse, AuthVerifyResponse>(apiResponse, (from) => from);
  });
};

/**
 * Execute this every time the page loads. Either verify or refresh the
 * OAuth token.
 */
export const fetchVerifyToken = (): Promise<AuthVerifyResponse> => {
  return processServiceCall(async () => {
    const apiResponse = await fetchClient.get(Endpoints.OauthVerify).json<AuthVerifyResponse>();
    return deepCloneMapper<AuthVerifyResponse, AuthVerifyResponse>(apiResponse, (from) => from);
  });
};
