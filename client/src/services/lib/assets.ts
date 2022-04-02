import { fetchClient } from 'services/api';

import { deepCloneMapper } from 'services/utils/deepCloneMapper';
import { processServiceCall } from 'services/utils/processServiceCall';

import { Endpoints } from 'services/lib/endpoints';
import {
  FetchPaginatedCharacterAssetsResponse,
  FetchMarketOrderResponse,
} from 'services/types/response-type-api';

import { mockCharacterAssetsResponse } from './mocks/character-assets-response';

/**
 * Fetch character assets
 */
export const fetchCharacterAssets = (): Promise<FetchPaginatedCharacterAssetsResponse> => {
  return Promise.resolve(mockCharacterAssetsResponse);

  return processServiceCall(async () => {
    const apiResponse = await fetchClient
      .get(Endpoints.AssetsCharacter)
      .json<FetchPaginatedCharacterAssetsResponse>();

    return deepCloneMapper<
      FetchPaginatedCharacterAssetsResponse,
      FetchPaginatedCharacterAssetsResponse
    >(apiResponse, (from) => from);
  });
};

/**
 * Fetch orders based on typeIds
 * @param typeIds
 */
export const fetchOrders = (typeIds: number[]): Promise<FetchMarketOrderResponse> => {
  return processServiceCall(async () => {
    const apiResponse = await fetchClient
      .post(Endpoints.AssetsOrders, {
        json: { typeIds },
      })
      .json<FetchMarketOrderResponse>();

    return deepCloneMapper<FetchMarketOrderResponse, FetchMarketOrderResponse>(
      apiResponse,
      (from) => from,
    );
  });
};
