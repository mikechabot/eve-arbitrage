export const AppEnv = {
  BaseUrl: process.env.REACT_APP_BASE_URL!,
  BaseApiUrl: process.env.REACT_APP_BASE_API_URL!,
  EveClientId: process.env.REACT_APP_EVE_CLIENT_ID!,
  EveAuthUrl: process.env.REACT_APP_EVE_AUTH_URL!,
};

export const AppEnvironment = {
  Test: 'test',
  Prod: 'prod',
} as const;
