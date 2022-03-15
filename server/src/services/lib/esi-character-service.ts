import { EsiService } from 'src/services/lib/esi-service';
import { EsiStructureService } from 'src/services/lib/esi-structure-api';

import { LocationFlag } from 'src/services/types/location-api';

import {
  EveCharacterDetailsApiV5,
  EveCharacterPortraitApiV3,
  EveCharacterWalletApiV1,
  EveInventoryAssetsApiV5,
  PaginatedCharacterAssets,
} from 'src/services/types/character-api';

import { StationRepository } from 'src/repositories/StationRepository';
import { ItemTypeRepository } from 'src/repositories/ItemTypeRepository';
import { StructureRepository } from 'src/repositories/StructureRepository';

interface EsiCharacterServiceOpts {
  esiService: EsiService;
  esiStructureService: EsiStructureService;
  itemTypeRepository: ItemTypeRepository;
  stationRepository: StationRepository;
  structureRepository: StructureRepository;
}

const ESI_PAGE_SIZE = 1000;
const STATION_ID_RANGE_LOW = 60000000;
const STATION_ID_RANGE_HIGH = 64000000;

export class EsiCharacterService {
  private readonly esiService: EsiService;
  private readonly esiStructureService: EsiStructureService;
  private readonly itemTypeRepository: ItemTypeRepository;
  private readonly stationRepository: StationRepository;
  private readonly structureRepository: StructureRepository;

  constructor({
    esiService,
    esiStructureService,
    itemTypeRepository,
    stationRepository,
    structureRepository,
  }: EsiCharacterServiceOpts) {
    this.esiService = esiService;
    this.esiStructureService = esiStructureService;
    this.itemTypeRepository = itemTypeRepository;
    this.stationRepository = stationRepository;
    this.structureRepository = structureRepository;
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
   * This calls the ESI endpoint, but also maps the asset data to static data
   * we've loaded in the database.
   * @param accessToken
   * @param characterId
   * @param page
   */
  async fetchAssets(
    accessToken: string,
    characterId: number,
    page: number,
  ): Promise<PaginatedCharacterAssets> {
    const assets = await this.fetchRawAssets(accessToken, characterId, page);
    const itemTypeByTypeId = await this.itemTypeRepository.getItemTypeByTypeIdMap();
    const stationByStationId = await this.stationRepository.getStationByStationIdMap();
    const structureByLocationId = await this.structureRepository.getStationByLocationIdMap();

    const structureCacheMisses: number[] = [];

    /**
     * The ESI endpoint returns 1,000 assets per page. If we have
     * less than 1,000 assets, then return a dead page number (-1),
     * otherwise increment the page.
     */
    let nextPage = assets.length < ESI_PAGE_SIZE ? -1 : page + 1;

    assets.forEach((asset) => {
      if (itemTypeByTypeId[asset.type_id]) {
        asset.typeName = itemTypeByTypeId[asset.type_id].typeName;
      }

      /**
       * Map NPC stations to the location
       */
      if (
        stationByStationId[asset.location_id] &&
        asset.location_id > STATION_ID_RANGE_LOW &&
        asset.location_id < STATION_ID_RANGE_HIGH
      ) {
        asset.stationName = stationByStationId[asset.location_id].stationName;
      }

      /**
       * Map player-owned stations
       */
      if (asset.location_flag === LocationFlag.Hangar && !asset.stationName) {
        if (structureByLocationId[asset.location_id]) {
          asset.stationName = structureByLocationId[asset.location_id].name;
        } else {
          structureCacheMisses.push(asset.location_id);
        }
      }
    });

    /**
     * Fetch player-owned structures to be inserted
     */
    const structurePromises = structureCacheMisses.map((structureId) =>
      this.esiStructureService.fetchStructures(accessToken, structureId),
    );

    if (structurePromises.length > 0) {
      try {
        /**
         * Wait for the ESI to return player-owned structures
         */
        const structures = await Promise.all(structurePromises);

        /**
         * Insert player-owned structures into database
         */
        const insertPromises = structures.map((structure, index) =>
          this.structureRepository.insertStructure(structureCacheMisses[index], structure),
        );

        /**
         * Wait for inserts to complete
         */
        await Promise.all(insertPromises);

        /**
         * Refetch the structure map
         */
        const updatedStructureByLocationId =
          await this.structureRepository.getStationByLocationIdMap();

        /**
         * Map player-owned stations
         */
        assets.forEach((asset) => {
          if (asset.location_flag === LocationFlag.Hangar && !asset.stationName) {
            if (updatedStructureByLocationId[asset.location_id]) {
              asset.stationName = updatedStructureByLocationId[asset.location_id].name;
            }
          }
        });
      } catch (e) {
        console.error('Unable to fetch or insert ESI structure(s)');
        throw e;
      }
    }

    return {
      nextPage,
      data: assets,
    };
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

  /**
   * https://esi.evetech.net/ui/#/Assets/get_characters_character_id_assets
   * @param accessToken
   * @param characterId
   * @param page
   */
  private fetchRawAssets(
    accessToken: string,
    characterId: number,
    page: number,
  ): Promise<EveInventoryAssetsApiV5> {
    return this.esiService.fetch<EveInventoryAssetsApiV5>(
      accessToken,
      `v5/characters/${characterId}/assets?page=${page}`,
    );
  }
}
