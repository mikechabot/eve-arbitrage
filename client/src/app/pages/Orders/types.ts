import { EveMarketOrderApiV1 } from 'services/types/assets-api';
import { EveInventoryAssetV5 } from 'services/types/character-api';

export interface EveMarketOrderAsset {
  order?: EveMarketOrderApiV1;
  asset: EveInventoryAssetV5;
}

export type OrderAssetSalePrice = Record<number, number>;
