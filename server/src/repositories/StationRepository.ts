import { EntityRepository, Repository } from 'typeorm';

import { Station } from 'src/entities/Station';

/**
 * This handle static NPC station structures
 */
@EntityRepository(Station)
export class StationRepository extends Repository<Station> {
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
