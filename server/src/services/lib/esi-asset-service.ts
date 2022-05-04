import { EsiService } from 'src/services/lib/esi-service';
import { EsiStructureService } from 'src/services/lib/esi-structure-api';
import { LocationFlag } from 'src/services/types/location-api';

import {
  EveInventoryAssetsApiV5,
  PaginatedCharacterAssets,
} from 'src/services/types/character-api';

import { StationRepository } from 'src/repositories/StationRepository';
import { ItemTypeRepository } from 'src/repositories/ItemTypeRepository';
import { StructureRepository } from 'src/repositories/StructureRepository';
import { EveMarketOrderApiV1 } from 'src/services/types/assets-api';

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
    const rawAssets = await this.fetchRawAssets(accessToken, characterId, page);
    const itemTypeByTypeId = await this.itemTypeRepository.getItemTypeByTypeIdMap();
    const stationByStationId = await this.stationRepository.getStationByStationIdMap();
    const structureByLocationId = await this.structureRepository.getStationByLocationIdMap();

    const assets = rawAssets.filter((asset) => asset.location_flag === LocationFlag.Hangar);

    /**
     * The ESI endpoint returns 1,000 assets per page. If we have
     * less than 1,000 assets, then return a dead page number (-1),
     * otherwise increment the page.
     */
    let nextPage = rawAssets.length < ESI_PAGE_SIZE ? -1 : page + 1;

    for (const asset of assets) {
      /**
       * Map "typeId" to statically held "typeName"
       */
      const type = itemTypeByTypeId[asset.type_id];
      if (type) {
        asset.typeName = type.typeName;
        asset.groupName = type.group?.groupName || '';
        asset.categoryName = type.group?.category?.categoryName || '';
        asset.volume = type?.volume || 0;
      }

      asset.stationName = '';

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

  async fetchMaxOrdersByTypeId(
    accessToken: string,
    typeIds: number[],
  ): Promise<Record<number, EveMarketOrderApiV1>> {
    const orderByTypeId: Record<number, EveMarketOrderApiV1> = {};

    for (const typeId of typeIds) {
      const orders = await this.fetchRawOrder(accessToken, typeId);
      if (!orders) {
        continue;
      }

      /**
       * Find the max order price
       */
      let maxOrder: EveMarketOrderApiV1 = orders[0];
      (orders || []).forEach((order) => {
        if (order.price > maxOrder.price) {
          maxOrder = order;
        }
      });

      orderByTypeId[typeId] = maxOrder;
    }
    return orderByTypeId;
  }

  private fetchRawOrder(accessToken: string, typeId: number): Promise<EveMarketOrderApiV1[]> {
    return this.esiService.fetch<EveMarketOrderApiV1[]>(
      accessToken,
      `v1/markets/10000002/orders?order_type=buy&page=1&type_id=${typeId}`,
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
