import { EntityRepository, Repository } from 'typeorm';

import { Station } from 'src/entities/Station';

@EntityRepository(Station)
export class StationRepository extends Repository<Station> {
  insertNpcStation(station: Station) {
    return this.insert({ ...station, isNpc: true });
  }

  findByStationId(stationId: number): Promise<Station | undefined> {
    return this.findOne({ stationId });
  }

  async getStationByStationIdMap(): Promise<Record<number, Station>> {
    const stations = await this.find({});

    const stationByStationId = {} as Record<number, Station>;
    stations!.forEach((station) => {
      stationByStationId[station.stationId] = station;
    });

    return stationByStationId;
  }
}
