import { fetchClient } from 'services/api';

import { deepCloneMapper } from 'services/utils/deepCloneMapper';
import { processServiceCall } from 'services/utils/processServiceCall';

import { Endpoints } from 'services/lib/endpoints';
import { CharacterResponse } from 'services/types/character-api';

import { mockCharacterResponse } from './mocks/character-response';

export const fetchCharacter = (): Promise<CharacterResponse> => {
  return Promise.resolve(mockCharacterResponse);

  return processServiceCall(async () => {
    const apiResponse = await fetchClient.get(Endpoints.Character).json<any>();

    return deepCloneMapper<CharacterResponse, CharacterResponse>(apiResponse, (from) => from);
  });
};
