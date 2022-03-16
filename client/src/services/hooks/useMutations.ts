import { useMutation, UseMutationOptions } from 'react-query';

import { postLogin, postLogout } from 'services/lib/auth';

import { ServiceError } from 'services/utils/ServiceError';
import { AuthChallengeResponse } from 'services/types/response-type-api';

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
