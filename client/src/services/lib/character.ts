import { fetchClient } from 'services/api';

import { deepCloneMapper } from 'services/utils/deepCloneMapper';
import { processServiceCall } from 'services/utils/processServiceCall';

import { Endpoints } from 'services/lib/endpoints';
import { FetchCharacterDetailsResponse } from 'services/types/response-type-api';

import { mockCharacterResponse } from './mocks/character-response';

export const fetchCharacter = (): Promise<FetchCharacterDetailsResponse> => {
  return Promise.resolve(mockCharacterResponse);

  return processServiceCall(async () => {
    const apiResponse = await fetchClient
      .get(Endpoints.Character)
      .json<FetchCharacterDetailsResponse>();

    return deepCloneMapper<FetchCharacterDetailsResponse, FetchCharacterDetailsResponse>(
      apiResponse,
      (from) => from,
    );
  });
};
