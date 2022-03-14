import { EsiService } from 'src/services/lib/esi-service';

import {
  EveCharacterDetailsApiV5,
  EveCharacterPortraitApiV3,
  EveCharacterWalletApiV1,
  EveInventoryAssetsApiV5,
  PaginatedCharacterAssets,
} from 'src/services/types/character-api';

import { StationRepository } from 'src/repositories/StationRepository';
import { ItemTypeRepository } from 'src/repositories/ItemTypeRepository';

interface EsiCharacterServiceOpts {
  esiService: EsiService;
  itemTypeRepository: ItemTypeRepository;
  stationRepository: StationRepository;
}

const ESI_PAGE_SIZE = 1000;
const STATION_ID_RANGE_LOW = 60000000;
const STATION_ID_RANGE_HIGH = 64000000;

export class EsiCharacterService {
  private readonly esiService: EsiService;
  private readonly itemTypeRepository: ItemTypeRepository;
  private readonly stationRepository: StationRepository;

  constructor({ esiService, itemTypeRepository, stationRepository }: EsiCharacterServiceOpts) {
    this.esiService = esiService;
    this.itemTypeRepository = itemTypeRepository;
    this.stationRepository = stationRepository;
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
      if (
        stationByStationId[asset.location_id] &&
        asset.location_id > STATION_ID_RANGE_LOW &&
        asset.location_id < STATION_ID_RANGE_HIGH
      ) {
        asset.stationName = stationByStationId[asset.location_id].stationName;
      }
    });

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
