import { useQuery, UseQueryOptions } from 'react-query';

import { QueryKey } from 'services/query-key';

import { ServiceError } from 'services/utils/ServiceError';
import { fetchUserAssets } from 'services/lib/assets';
import { useAuthContext } from 'hooks/useAuthContext';

export const useUserAssetsQuery = <ReturnData extends any = any>(
  options?: UseQueryOptions<any, ServiceError, ReturnData>,
) => {
  const { code } = useAuthContext();
  return useQuery<any, ServiceError, ReturnData>(
    [QueryKey.User, code],
    () => fetchUserAssets(code!),
    options,
  );
};
