import { fetchClient } from 'services/api';

import { deepCloneMapper } from 'services/utils/deepCloneMapper';
import { processServiceCall } from 'services/utils/processServiceCall';

import { Endpoints } from 'services/lib/endpoints';
import { CharacterResponse } from 'services/types/character-api';
import { mockCharacterResponse } from './mocks/character-response';

/**
 * API contracts
 */
// import { APIStatisticsQueryResponse } from 'services/types/statistics-api';

/**
 * Domain contracts
 */
// import { Statistics } from 'services/types/statistics';

export const fetchCharacter = (): Promise<CharacterResponse> => {
  // return Promise.resolve(mockCharacterResponse);

  return processServiceCall(async () => {
    const apiResponse = await fetchClient.get(Endpoints.Character).json<any>();

    return deepCloneMapper<CharacterResponse, CharacterResponse>(apiResponse, (from) => from);
  });
};
