import { useMutation, UseMutationOptions } from 'react-query';

import { postCodeForOauthToken } from 'services/lib/auth';
import { ServiceError } from 'services/utils/ServiceError';

export const usePostCodeForOauthToken = (options?: UseMutationOptions<any, ServiceError, any>) => {
  return useMutation<any, ServiceError, any>((code: string) => {
    return postCodeForOauthToken(code);
  }, options);
};
