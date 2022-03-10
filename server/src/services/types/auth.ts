export interface SsoMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  response_types_supported: string[];
  jwks_uri: string;
  revocation_endpoint: string;
  revocation_endpoint_auth_methods_supported: string[];
  token_endpoint_auth_methods_supported: string[];
  token_endpoint_auth_signing_alg_values_supported: string[];
  code_challenge_methods_supported: string[];
}

export interface OauthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
}

export interface JsonWebKeyRS256 {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

export interface JsonWebKeyES256 {
  alg: string;
  crv: string;
  kid: string;
  kty: string;
  use: string;
  x: string;
  y: string;
}

export interface JsonWebKeySet {
  keys: (JsonWebKeyRS256 | JsonWebKeyES256)[];
  SkipUnresolvedJsonWebKeys: boolean;
}

export interface JwksClientSigningKey {
  kid: string;
  alg: string;
  publicKey: any; // Getter
  rsaPublicKey: any; // Getter
  getPublicKey: () => string;
}
