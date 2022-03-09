import { fetchClient } from 'services/api';

import { deepCloneMapper } from 'services/utils/deepCloneMapper';

import { buildEndpoint, Endpoints } from 'services/lib/endpoints';
import { processServiceCall } from 'services/utils/processServiceCall';

/**
 * API contracts
 */
// import { APIStatisticsQueryResponse } from 'services/types/statistics-api';

/**
 * Domain contracts
 */
// import { Statistics } from 'services/types/statistics';

export const fetchUserAssets = (code: string): Promise<any> => {
  return processServiceCall(async () => {
    const apiResponse = await fetchClient.get(Endpoints.User).json<any>();

    return deepCloneMapper<any, any>(apiResponse, (from) => from);
  });
};
