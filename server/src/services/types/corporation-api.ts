/**
 * https://esi.evetech.net/ui/#/Corporation/get_corporations_corporation_id
 */
export interface EveCorporationApiV5 {
  ceo_id: number;
  creator_id: number;
  description: string;
  home_station_id: number;
  member_count: number;
  name: string;
  shares: number;
  tax_rate: number;
  ticker: string;
  url: string;
}
