import fetch from 'cross-fetch';

import { Endpoints } from 'src/services/endpoints';

import {
  CharacterApi,
  EveCharacterDetailsApiV5,
  EveCharacterPortraitApiV3,
  EveCharacterWalletApiV1,
  EveInventoryAssetsApiV5,
} from 'src/services/types/character-api';

import { EveCorporationApiV5 } from 'src/services/types/corporation-api';

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

/**
 * https://esi.evetech.net/ui/#/Character/get_characters_character_id
 * @param accessToken
 * @param characterId
 */
export const fetchEveCharacterDetails = async (
  accessToken: string,
  characterId: number,
): Promise<EveCharacterDetailsApiV5> => {
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
    console.error('Error fetching character details');
    return e;
  }
};

/**
 * https://esi.evetech.net/ui/#/Character/get_characters_character_id_portrait
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
      },
    );

    return await characterPortrait.json();
  } catch (e) {
    console.error('Error fetching character portrait');
    return e;
  }
};

/**
 * https://esi.evetech.net/ui/#/Corporation/get_corporations_corporation_id
 * @param accessToken
 * @param corporationId
 */
export const fetchEveCharacterCorporation = async (
  accessToken: string,
  corporationId: number,
): Promise<EveCorporationApiV5> => {
  try {
    const corporation = await fetch(`${Endpoints.EveTech}/v5/corporations/${corporationId}`, {
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

    return await corporation.json();
  } catch (e) {
    console.error('Error fetching character portrait');
    return e;
  }
};

/**
 * https://esi.evetech.net/ui/#/Assets/get_characters_character_id_assets
 * @param accessToken
 * @param character_id
 * @param page
 */
export const fetchEvePaginatedCharacterAssets = async (
  accessToken: string,
  character_id: number,
  page: number,
): Promise<EveInventoryAssetsApiV5> => {
  try {
    const assets = await fetch(
      `${Endpoints.EveTech}/v5/characters/${character_id}/assets?page=${page}`,
      {
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
      },
    );

    return await assets.json();
  } catch (e) {
    console.error('Error fetching character portrait');
    return e;
  }
};

/**
 * https://esi.evetech.net/ui/#/Wallet/get_characters_character_id_wallet
 * @param accessToken
 * @param character_id
 */
export const fetchEveCharacterWallet = async (
  accessToken: string,
  character_id: number,
): Promise<EveCharacterWalletApiV1> => {
  try {
    const wallet = await fetch(`${Endpoints.EveTech}/v1/characters/${character_id}/wallet`, {
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

    return await wallet.json();
  } catch (e) {
    console.error('Error fetching character portrait');
    return e;
  }
};

/**
 * https://esi.evetech.net/ui/#/Assets/get_corporations_corporation_id_assets
 * /v5/corporations/{corporation_id}/assets/
 * @param accessToken
 * @param corporationId
 */
export const fetchEveCorporationAssets = async (
  accessToken: string,
  corporationId: number,
): Promise<EveCharacterWalletApiV1> => {
  try {
    const wallet = await fetch(`${Endpoints.EveTech}/v5/corporations/${corporationId}/assets/`, {
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

    return await wallet.json();
  } catch (e) {
    console.error('Error fetching character portrait');
    return e;
  }
};
