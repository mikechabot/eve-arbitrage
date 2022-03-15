import { useQuery, UseQueryOptions } from 'react-query';

import { QueryKey } from 'services/query-key';

import { fetchCharacter } from 'services/lib/character';
import { fetchVerifyToken } from 'services/lib/auth';

import { ServiceError } from 'services/utils/ServiceError';
import { AuthVerifyResponse } from 'services/types/auth-api';
import { CharacterResponse } from 'services/types/character-api';

/**
 * Fetch information about the logged in character
 * @param options
 */
export const useCharacterQuery = <ReturnData extends any = CharacterResponse>(
  options?: UseQueryOptions<any, ServiceError, ReturnData>,
) => {
  return useQuery<CharacterResponse, ServiceError, ReturnData>(
    QueryKey.User,
    () => fetchCharacter(),
    { ...options, refetchOnWindowFocus: false },
  );
};

/**
 * Verify and/or refresh the JWT cookie
 * @param options
 */
export const useOauthVerifyQuery = <ReturnData extends any = AuthVerifyResponse>(
  options?: UseQueryOptions<any, ServiceError, ReturnData>,
) =>
  useQuery<any, ServiceError, ReturnData>(QueryKey.Verify, () => fetchVerifyToken(), {
    ...options,
    refetchOnWindowFocus: false,
  });
