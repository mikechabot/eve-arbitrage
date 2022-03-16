import { EsiService } from 'src/services/lib/esi-service';
import { EsiStructureService } from 'src/services/lib/esi-structure-api';
import { LocationFlag } from 'src/services/types/location-api';

import {
  EveCharacterPortraitApiV3,
  EveInventoryAssetsApiV5,
  PaginatedCharacterAssets,
} from 'src/services/types/character-api';

import { StationRepository } from 'src/repositories/StationRepository';
import { ItemTypeRepository } from 'src/repositories/ItemTypeRepository';
import { StructureRepository } from 'src/repositories/StructureRepository';

interface EsiAssetServiceOpts {
  esiService: EsiService;
  esiStructureService: EsiStructureService;
  itemTypeRepository: ItemTypeRepository;
  stationRepository: StationRepository;
  structureRepository: StructureRepository;
}

const ESI_PAGE_SIZE = 1000;
const STATION_ID_RANGE_LOW = 60000000;
const STATION_ID_RANGE_HIGH = 64000000;

export class EsiAssetService {
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
  }: EsiAssetServiceOpts) {
    this.esiService = esiService;
    this.esiStructureService = esiStructureService;
    this.itemTypeRepository = itemTypeRepository;
    this.stationRepository = stationRepository;
    this.structureRepository = structureRepository;
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

    assets.push({
      is_singleton: false,
      item_id: 0,
      location_type: 'station',
      quantity: 0,
      type_id: 0,
      location_id: 1035768580719,
      location_flag: LocationFlag.Hangar,
    });

    /**
     * The ESI endpoint returns 1,000 assets per page. If we have
     * less than 1,000 assets, then return a dead page number (-1),
     * otherwise increment the page.
     */
    let nextPage = assets.length < ESI_PAGE_SIZE ? -1 : page + 1;

    for (const asset of assets) {
      /**
       * Map "typeId" to statically held "typeName"
       */
      const type = itemTypeByTypeId[asset.type_id];
      if (type) {
        asset.typeName = type.typeName;
        asset.groupName = type.group?.groupName || '';
        asset.categoryName = type.group?.category?.categoryName || '';
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

      if (!asset.stationName && asset.location_flag === LocationFlag.Hangar) {
        if (structureByLocationId[asset.location_id]) {
          asset.stationName = structureByLocationId[asset.location_id].name;
        } else {
          const structure = await this.esiStructureService.fetchStructures(
            accessToken,
            asset.location_id,
          );
          await this.structureRepository.insertStructure(asset.location_id, structure);
          asset.stationName = structure.name;
        }
      }
    }

    return {
      assets,
      nextPage,
    };
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
