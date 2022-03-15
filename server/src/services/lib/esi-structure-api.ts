import { EsiService } from 'src/services/lib/esi-service';

import { EveStructureApiV2 } from 'src/services/types/structure-api';

interface EsiStructureServiceOpts {
  esiService: EsiService;
}

export class EsiStructureService {
  private readonly esiService: EsiService;

  constructor(opts: EsiStructureServiceOpts) {
    this.esiService = opts.esiService;
  }

  /**
   * https://esi.evetech.net/ui/#/Universe/get_universe_structures
   * @param accessToken
   * @param structureId
   */
  fetchStructures(accessToken: string, structureId: number): Promise<EveStructureApiV2> {
    return this.esiService.fetch<EveStructureApiV2>(
      accessToken,
      `v2/universe/structures/${structureId}`,
    );
  }
}
