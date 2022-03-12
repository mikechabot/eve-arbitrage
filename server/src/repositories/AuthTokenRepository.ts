import { getRepository, Repository } from 'typeorm';

import { AuthToken } from 'src/entities/AuthToken';
import { OauthTokenApi } from 'src/services/types/auth-api';

export class AuthTokenRepository extends Repository<AuthToken> {
  private readonly repository: Repository<AuthToken>;

  constructor() {
    super();
    this.repository = getRepository(AuthToken);
  }

  insertToken(token: OauthTokenApi) {
    return this.repository.insert({ ...token, isValid: true });
  }

  invalidateToken(token: AuthToken) {
    return this.repository.update(token.id, { ...token, isValid: false });
  }

  getTokenByJwt(jwt: string): Promise<AuthToken | undefined> {
    return this.repository.findOne({ access_token: jwt });
  }
}
