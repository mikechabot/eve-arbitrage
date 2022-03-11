import { AuthResponse } from 'src/routers/types/shared-api';

export const ChallengeType = {
  SSO: 'sso',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ChallengeType = typeof ChallengeType[keyof typeof ChallengeType];

export interface AuthVerifyResponse extends AuthResponse {
  challenge?: ChallengeType;
}
