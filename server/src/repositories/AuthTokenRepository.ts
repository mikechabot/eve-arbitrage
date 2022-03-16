import { EntityRepository, Repository } from 'typeorm';

import { OAuthToken } from 'src/entities/OAuthToken';
import { OauthTokenApi } from 'src/services/types/oauth-api';

@EntityRepository(OAuthToken)
export class AuthTokenRepository extends Repository<OAuthToken> {
  insertToken(token: OauthTokenApi, characterId: number) {
    return this.insert({ ...token, isValid: true, characterId });
  }

  invalidateToken(token: OAuthToken) {
    return this.update(token.id, { ...token, isValid: false });
  }

  findByJwt(jwt: string): Promise<OAuthToken | undefined> {
    return this.findOne({ access_token: jwt });
  }
}
