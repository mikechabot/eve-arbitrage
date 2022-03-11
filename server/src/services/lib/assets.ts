import fetch from 'cross-fetch';

import { Endpoints } from 'src/services/endpoints';
import {Character, CharacterDetails, CharacterPortrait} from 'src/services/types/character';

/**
 * This goes straight to EVE's verification endpoint to pull
 * the character info
 *
 * https://login.eveonline.com/oauth/verify
 * @param accessToken
 */
export const verifyJwtAndGetCharacter = async (accessToken: string): Promise<Character> => {
  try {
    const character = await fetch(Endpoints.OauthVerify, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        /**
         * Required by EVE
         */
        Host: 'login.eveonline.com',
        /**
         * Tell fetch we're expecting JSON back
         */
        Accept: 'application/json',
      },
    });

    return await character.json();
  } catch (e) {
    console.error('Unable to validate OAuth access token for base character');
    return e;
  }
};

export const fetchCharacterDetails = async (
  accessToken: string,
  characterId: number,
): Promise<CharacterDetails> => {
  try {
    const characterDetails = await fetch(`${Endpoints.EveTech}/v5/characters/${characterId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        /**
         * Required by EVE
         */
        Host: 'esi.evetech.net',
        /**
         * Tell fetch we're expecting JSON back
         */
        Accept: 'application/json',
      },
    });

    return await characterDetails.json();
  } catch (e) {
    console.error('Unable to validate OAuth access token for base character');
    return e;
  }
};

export const fetchCharacterPortrait = async (
  accessToken: string,
  characterId: number,
): Promise<CharacterPortrait> => {
  try {
    const characterPortrait = await fetch(`${Endpoints.EveTech}/v3/characters/${characterId}/portrait`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        /**
         * Required by EVE
         */
        Host: 'esi.evetech.net',
        /**
         * Tell fetch we're expecting JSON back
         */
        Accept: 'application/json',
      },
    });

    return await characterPortrait.json();
  } catch (e) {
    console.error('Unable to validate OAuth access token for base character');
    return e;
  }
};
