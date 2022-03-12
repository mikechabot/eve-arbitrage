import { EveCorporationApiV5 } from './corporation-api';

/**
 * https://login.eveonline.com/oauth/verify
 */
export interface CharacterApi {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string; // Space delimited scopes
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}

/**
 * https://esi.evetech.net/ui/#/Character/get_characters_character_id
 */
export interface EveCharacterDetailsApiV5 {
  birthday: string;
  bloodline_id: number;
  corporation_id: number;
  description?: string;
  faction_id?: string;
  gender: string;
  name: string;
  race_id: number;
  security_status?: number;
  title?: string;
}

/**
 * https://esi.evetech.net/ui/#/Character/get_characters_character_id_portrait
 */
export interface EveCharacterPortraitApiV3 {
  px128x128: string;
  px256x256: string;
  px512x512: string;
  px64x64: string;
}

/**
 * https://esi.evetech.net/ui/#/Wallet/get_characters_character_id_wallet
 */
export type EveCharacterWalletApiV1 = number;

/**
 * Domain object
 */
export interface CharacterResponse {
  verified: boolean;
  character?: {
    details: EveCharacterDetailsApiV5;
    portrait: EveCharacterPortraitApiV3;
    wallet: EveCharacterWalletApiV1;
    assets: PaginatedCharacterAssets;
  };
  corporation?: {
    details: EveCorporationApiV5;
  };
}

/**
 * https://esi.evetech.net/ui/#/Assets/get_characters_character_id_assets
 */
export interface EveInventoryAssetV5 {
  is_blueprint_copy?: boolean;
  is_singleton: boolean;
  item_id: number;
  location_flag: string;
  location_id: number;
  location_type: string;
  quantity: number;
  type_id: number;
}

/**
 * https://esi.evetech.net/ui/#/Assets/get_characters_character_id_assets
 */
export type EveInventoryAssetsApiV5 = EveInventoryAssetV5[];

/**
 * Domain object
 */
export interface PaginatedCharacterAssets {
  inventory?: EveInventoryAssetsApiV5;
  nextPage?: number;
}
