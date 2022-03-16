import { useQuery, UseQueryOptions } from 'react-query';

import { QueryKey } from 'services/query-key';

import { fetchCharacter } from 'services/lib/character';
import { fetchCharacterAssets } from 'services/lib/assets';
import { fetchVerifyToken } from 'services/lib/auth';

import { ServiceError } from 'services/utils/ServiceError';

import {
  AuthChallengeResponse,
  FetchCharacterDetailsResponse,
  FetchPaginatedCharacterAssetsResponse,
} from 'services/types/response-type-api';

/**
 * Fetch details about the logged-in character
 * @param options
 */
export const useCharacterQuery = <ReturnData extends any = FetchCharacterDetailsResponse>(
  options?: UseQueryOptions<any, ServiceError, ReturnData>,
) => {
  return useQuery<FetchCharacterDetailsResponse, ServiceError, ReturnData>(
    QueryKey.Character,
    () => fetchCharacter(),
    { ...options, refetchOnWindowFocus: false },
  );
};

/**
 * Fetch assets for the logged-in character
 * @param options
 */
export const useCharacterAssetsQuery = <
  ReturnData extends any = FetchPaginatedCharacterAssetsResponse,
>(
  options?: UseQueryOptions<any, ServiceError, ReturnData>,
) => {
  return useQuery<FetchPaginatedCharacterAssetsResponse, ServiceError, ReturnData>(
    QueryKey.AssetsCharacter,
    () => fetchCharacterAssets(),
    { ...options, refetchOnWindowFocus: false },
  );
};

/**
 * Verify and/or refresh the JWT cookie
 * @param options
 */
export const useOauthVerifyQuery = <ReturnData extends any = AuthChallengeResponse>(
  options?: UseQueryOptions<AuthChallengeResponse, ServiceError, ReturnData>,
) =>
  useQuery<AuthChallengeResponse, ServiceError, ReturnData>(
    QueryKey.Verify,
    () => fetchVerifyToken(),
    {
      ...options,
      refetchOnWindowFocus: false,
    },
  );
