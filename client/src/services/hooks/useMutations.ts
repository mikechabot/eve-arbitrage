import { useMutation, UseMutationOptions } from 'react-query';

import { postLogin, postLogout } from 'services/lib/auth';

import { ServiceError } from 'services/utils/ServiceError';
import { AuthTokenResponse, AuthVerifyResponse } from 'services/types/auth-api';

export type PostCodeForOauthTokenProps = string;

export const usePostCodeForOauthToken = (
  options?: UseMutationOptions<AuthTokenResponse, ServiceError, PostCodeForOauthTokenProps>,
) => {
  return useMutation<AuthTokenResponse, ServiceError, PostCodeForOauthTokenProps>(
    (code: string) => {
      return postLogin(code);
    },
    options,
  );
};

export const usePostLogout = (options?: UseMutationOptions<AuthVerifyResponse, ServiceError>) => {
  return useMutation<AuthVerifyResponse, ServiceError>(() => {
    return postLogout();
  }, options);
};
