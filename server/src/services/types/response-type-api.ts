import { EveCorporationApiV5 } from 'src/services/types/corporation-api';

import {
  EveCharacterDetailsApiV5,
  EveCharacterPortraitApiV3,
  EveCharacterWalletApiV1,
  PaginatedCharacterAssets,
} from 'src/services/types/character-api';
import {EveMarketOrderApiV1} from "src/services/types/assets-api";

export interface AuthResponse {
  verified: boolean;
}

export const ChallengeType = {
  SSO: 'sso',
} as const;

export type ChallengeType = typeof ChallengeType[keyof typeof ChallengeType];

export interface AuthChallengeResponse extends AuthResponse {
  challenge?: ChallengeType;
}

export interface FetchCharacterDetailsResponse extends AuthResponse {
  character?: {
    details: EveCharacterDetailsApiV5;
    portrait: EveCharacterPortraitApiV3;
    wallet: EveCharacterWalletApiV1;
  };
  corporation?: EveCorporationApiV5;
}

export interface FetchPaginatedCharacterAssetsResponse
  extends PaginatedCharacterAssets,
    AuthResponse {}

export interface FetchMarketOrderResponse extends AuthResponse {
  order?: EveMarketOrderApiV1;
}
