import fetch from 'cross-fetch';

import { Endpoints } from 'src/services/endpoints';

import {
  CharacterApi,
  EveCharacterDetailsApiV5,
  EveCharacterPortraitApiV3,
} from 'src/services/types/character-api';

import { buildDefaultEveTechHeaders } from 'src/services/utils';

/**
 * This goes straight to EVE's verification endpoint to pull
 * the base character info
 *
 * https://login.eveonline.com/oauth/verify
 * @param accessToken
 */
export const fetchEveCharacter = async (accessToken: string): Promise<CharacterApi> => {
  try {
    const character = await fetch(Endpoints.OauthVerify, {
      headers: buildDefaultEveTechHeaders(accessToken),
    });

    return await character.json();
  } catch (e) {
    console.error('Unable to validate OAuth access obtainOauthToken for base character');
    return e;
  }
};

/**
 * https://esi.evetech.net/ui/#/Character/get_characters_character_id
 * /characters/{character_id}/
 * @param accessToken
 * @param characterId
 */
export const fetchEveCharacterDetails = async (
  accessToken: string,
  characterId: number,
): Promise<EveCharacterDetailsApiV5> => {
  try {
    const characterDetails = await fetch(`${Endpoints.EveTech}/v5/characters/${characterId}`, {
      headers: buildDefaultEveTechHeaders(accessToken),
    });

    return await characterDetails.json();
  } catch (e) {
    console.error('Error fetching character details');
    return e;
  }
};

/**
 * https://esi.evetech.net/ui/#/Character/get_characters_character_id_portrait
 * /characters/{character_id}/portrait/
 * @param accessToken
 * @param characterId
 */
export const fetchEveCharacterPortrait = async (
  accessToken: string,
  characterId: number,
): Promise<EveCharacterPortraitApiV3> => {
  try {
    const characterPortrait = await fetch(
      `${Endpoints.EveTech}/v3/characters/${characterId}/portrait`,
      {
        headers: buildDefaultEveTechHeaders(accessToken),
      },
    );

    return await characterPortrait.json();
  } catch (e) {
    console.error('Error fetching character portrait');
    return e;
  }
};
