import { EsiService } from 'src/services/lib/esi-service';

import {
  EveCharacterDetailsApiV5,
  EveCharacterPortraitApiV3,
  EveCharacterWalletApiV1,
} from 'src/services/types/character-api';

interface EsiCharacterServiceOpts {
  esiService: EsiService;
}

export class EsiCharacterService {
  private readonly esiService: EsiService;

  constructor({ esiService }: EsiCharacterServiceOpts) {
    this.esiService = esiService;
  }

  /**
   * https://esi.evetech.net/ui/#/Character/get_characters_character_id
   * @param accessToken
   * @param characterId
   */
  fetchDetails(accessToken: string, characterId: number) {
    return this.esiService.fetch<EveCharacterDetailsApiV5>(
      accessToken,
      `v5/characters/${characterId}`,
    );
  }

  /**
   * https://esi.evetech.net/ui/#/Wallet/get_characters_character_id_wallet
   * @param accessToken
   * @param characterId
   */
  fetchWallet(accessToken: string, characterId: number): Promise<EveCharacterWalletApiV1> {
    return this.esiService.fetch<EveCharacterWalletApiV1>(
      accessToken,
      `v1/characters/${characterId}/wallet`,
    );
  }

  /**
   * https://esi.evetech.net/ui/#/Character/get_characters_character_id_portrait
   * @param accessToken
   * @param characterId
   */
  fetchPortrait(accessToken: string, characterId: number): Promise<EveCharacterPortraitApiV3> {
    return this.esiService.fetch<EveCharacterPortraitApiV3>(
      accessToken,
      `v3/characters/${characterId}/portrait`,
    );
  }
}
