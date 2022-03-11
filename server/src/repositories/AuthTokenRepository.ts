import { getRepository, Repository } from 'typeorm';

import { AuthToken } from 'src/entities/AuthToken';
import { OauthToken } from 'src/services/types/auth';

export class AuthTokenRepository extends Repository<AuthToken> {
  private readonly repository: Repository<AuthToken>;

  constructor() {
    super();
    this.repository = getRepository(AuthToken);
  }

  insertToken(token: OauthToken) {
    return this.repository.insert(token);
  }

  getTokenByJwt(jwt: string): Promise<OauthToken | undefined> {
    return this.repository.findOne({ access_token: jwt });
  }
}
