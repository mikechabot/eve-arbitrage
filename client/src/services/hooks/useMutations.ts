import { useMutation, UseMutationOptions } from 'react-query';

import { fetchOrders } from 'services/lib/assets';
import { postLogin, postLogout } from 'services/lib/auth';

import { ServiceError } from 'services/utils/ServiceError';
import { AuthChallengeResponse, FetchMarketOrderResponse } from 'services/types/response-type-api';

export type PostCodeForOauthTokenProps = string;

export const usePostCodeForOauthToken = (
  options?: UseMutationOptions<AuthChallengeResponse, ServiceError, PostCodeForOauthTokenProps>,
) => {
  return useMutation<AuthChallengeResponse, ServiceError, PostCodeForOauthTokenProps>(
    (code: string) => {
      return postLogin(code);
    },
    options,
  );
};

export const usePostLogout = (
  options?: UseMutationOptions<AuthChallengeResponse, ServiceError>,
) => {
  return useMutation<AuthChallengeResponse, ServiceError>(() => {
    return postLogout();
  }, options);
};

export type PostOrderProps = string;

/**
 * Verify and/or refresh the JWT cookie
 * @param typeId
 * @param options
 */
export const usePostOrder = (
  options?: UseMutationOptions<FetchMarketOrderResponse, ServiceError, PostOrderProps>,
) => {
  return useMutation<FetchMarketOrderResponse, ServiceError, PostOrderProps>((typeId) => {
    return fetchOrders(typeId);
  }, options);
};
