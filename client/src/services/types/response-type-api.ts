import { EveCorporationApiV5 } from 'services/types/corporation-api';

import {
  EveCharacterDetailsApiV5,
  EveCharacterPortraitApiV3,
  EveCharacterWalletApiV1,
  PaginatedCharacterAssets,
} from 'services/types/character-api';

export interface AuthResponse {
  verified: boolean;
}

export const ChallengeType = {
  SSO: 'sso',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ChallengeType = typeof ChallengeType[keyof typeof ChallengeType];

export interface AuthChallengeResponse extends AuthResponse {
  challenge?: ChallengeType;
}

export interface FetchCharacterDetailsResponse extends AuthResponse {
  character: {
    details: EveCharacterDetailsApiV5;
    portrait: EveCharacterPortraitApiV3;
    wallet: EveCharacterWalletApiV1;
  };
  corporation: EveCorporationApiV5;
}

export interface FetchPaginatedCharacterAssetsResponse
  extends PaginatedCharacterAssets,
    AuthResponse {}
