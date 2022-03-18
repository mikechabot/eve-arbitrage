export const EveOrderRangeApiV1 = {
  Station: 'station',
  Region: 'region',
  SolarSystem: 'solarsystem',
  '1': 1,
  '2': 2,
  '3': 2,
  '4': 2,
  '5': 2,
  '10': 2,
  '20': 2,
  '30': 2,
  '40': 2,
} as const;

export type EveOrderRangeApiV1 = typeof EveOrderRangeApiV1[keyof typeof EveOrderRangeApiV1];

export interface EveMarketOrderApiV1 {
  duration: string;
  is_buy_order: boolean;
  issued: string;
  location_id: number;
  min_volume: number;
  order_id: number;
  price: number;
  range: EveOrderRangeApiV1;
  system_id: number;
  type_id: number;
  volume_remain: number;
  volume_total: number;
}
