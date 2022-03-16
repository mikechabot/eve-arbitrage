import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';

import { OAuthToken } from 'src/entities/OAuthToken';
import { OauthTokenApi } from 'src/services/types/oauth-api';

interface AuthTokenServiceOpts {
  authTokenRepository: AuthTokenRepository;
}

export class OauthTokenService {
  private readonly authTokenRepository: AuthTokenRepository;

  constructor({ authTokenRepository }: AuthTokenServiceOpts) {
    this.authTokenRepository = authTokenRepository;
  }

  findJwtByCookie(cookies: Record<any, any> = {}): Promise<OAuthToken | undefined> {
    return this.authTokenRepository.findByJwt(cookies.jwt);
  }

  addToken(token: OauthTokenApi, characterId: number) {
    return this.authTokenRepository.insert({ ...token, isValid: true, characterId });
  }

  invalidateToken(oauthToken: OAuthToken) {
    return this.authTokenRepository.invalidateToken(oauthToken);
  }
}
