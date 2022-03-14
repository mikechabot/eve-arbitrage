import { EsiService } from 'src/services/lib/esi-service';

import { EveCorporationApiV5 } from 'src/services/types/corporation-api';

interface EsiCorporationServiceOpts {
  esiService: EsiService;
}

export class EsiCorporationService {
  private readonly esiService: EsiService;

  constructor(opts: EsiCorporationServiceOpts) {
    this.esiService = opts.esiService;
  }

  /**
   * https://esi.evetech.net/ui/#/Corporation/get_corporations_corporation_id
   * @param accessToken
   * @param corporationId
   */
  fetchDetails(accessToken: string, corporationId: number): Promise<EveCorporationApiV5> {
    return this.esiService.fetch<EveCorporationApiV5>(
      accessToken,
      `v5/corporations/${corporationId}`,
    );
  }

  /**
   * TODO: Get the right response type
   * https://esi.evetech.net/ui/#/Assets/get_corporations_corporation_id_assets
   * /v5/corporations/{corporation_id}/assets/
   * @param accessToken
   * @param corporationId
   */
  fetchAssets(accessToken: string, corporationId: number): Promise<EveCorporationApiV5> {
    return this.esiService.fetch<EveCorporationApiV5>(
      accessToken,
      `v5/corporations/${corporationId}/assets`,
    );
  }
}
