export interface Character {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string; // Space delimited scopes
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}

/**
 * https://esi.evetech.net/ui
 */
export interface CharacterDetails {
  birthday: string;
  bloodline_id: number;
  corporation_id: number;
  description: string;
  gender: string;
  name: string;
  race_id: number;
  security_status: number;
}

/**
 * https://esi.evetech.net/ui
 */
export interface CharacterPortrait {
  px128x128: string;
  px256x256: string;
  px512x512: string;
  px64x64: string;
}

export interface CharacterResponse {
  verified: boolean;
  character: Character;
  characterDetails: CharacterDetails;
  characterPortrait: CharacterPortrait;
}
