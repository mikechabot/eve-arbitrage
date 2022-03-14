import { EveLoginService } from 'src/services/lib/eve-login-service';

import { CharacterApi } from 'src/services/types/character-api';

interface EveCharacterServiceOpts {
  eveLoginService: EveLoginService;
}

export class EveCharacterService {
  private readonly eveLoginService: EveLoginService;

  constructor(opts: EveCharacterServiceOpts) {
    this.eveLoginService = opts.eveLoginService;
  }

  fetchCharacter(accessToken: string): Promise<CharacterApi> {
    return this.eveLoginService.fetch('oauth/verify', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
