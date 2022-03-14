import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';

import { AuthToken } from 'src/entities/AuthToken';
import { OauthTokenApi } from 'src/services/types/auth-api';

interface AuthTokenServiceOpts {
  authTokenRepository: AuthTokenRepository;
}

export class AuthTokenService {
  private readonly authTokenRepository: AuthTokenRepository;

  constructor({ authTokenRepository }: AuthTokenServiceOpts) {
    this.authTokenRepository = authTokenRepository;
  }

  findJwtByCookie(cookies: Record<any, any> = {}): Promise<AuthToken | undefined> {
    return this.authTokenRepository.findByJwt(cookies.jwt);
  }

  addToken(token: OauthTokenApi, characterId: number) {
    return this.authTokenRepository.insert({ ...token, isValid: true, characterId });
  }

  invalidateToken(oauthToken: AuthToken) {
    return this.authTokenRepository.invalidateToken(oauthToken);
  }
}
