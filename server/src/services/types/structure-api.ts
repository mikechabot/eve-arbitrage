/**
 * https://esi.evetech.net/ui/#/Universe/get_universe_structures
 * https://esi.evetech.net/ui/#/Universe/get_universe_stations_station_id
 */
export interface EveStructureApiV2 {
  name: string;
  owner_id: number;
  solar_system_id: number;
  type_id?: number;
}
