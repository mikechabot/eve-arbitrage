type SuccessResponse = { success: boolean };

export const ChallengeType = {
  SSO: 'sso',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ChallengeType = typeof ChallengeType[keyof typeof ChallengeType];

export interface AuthVerifyResponse {
  verified: false;
  challenge: ChallengeType;
}
export type AuthTokenResponse = SuccessResponse;
