import { EntityRepository, Repository } from 'typeorm';

import { AuthToken } from 'src/entities/AuthToken';
import { OauthTokenApi } from 'src/services/types/auth-api';

@EntityRepository(AuthToken)
export class AuthTokenRepository extends Repository<AuthToken> {
  insertToken(token: OauthTokenApi, characterId: number) {
    return this.insert({ ...token, isValid: true, characterId });
  }

  invalidateToken(token: AuthToken) {
    return this.update(token.id, { ...token, isValid: false });
  }

  findByJwt(jwt: string): Promise<AuthToken | undefined> {
    return this.findOne({ access_token: jwt });
  }
}
