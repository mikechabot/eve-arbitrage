export const Endpoints = {
  OauthToken: 'https://login.eveonline.com/v2/oauth/token',
  SsoMetadata: 'https://login.eveonline.com/.well-known/oauth-authorization-server',
  OauthAuthorize: 'https://login.eveonline.com/v2/oauth/authorize',
  OauthJwks: 'https://login.eveonline.com/oauth/jwks',
  OauthVerify: 'https://login.eveonline.com/oauth/verify',
  OauthIssuer: 'login.eveonline.com'
} as const;
