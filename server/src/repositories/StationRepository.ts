import { getRepository, Repository } from 'typeorm';

import { Station } from 'src/entities/Station';

export class StationRepository extends Repository<Station> {
  private readonly repository: Repository<Station>;

  constructor() {
    super();
    this.repository = getRepository(Station);
  }

  findAll(): Promise<Station[] | undefined> {
    return this.repository.find({});
  }

  insertStation(station: Station) {
    return this.repository.insert({ ...station, isNpc: true });
  }

  getStationByStationId(stationId: number): Promise<Station | undefined> {
    return this.repository.findOne({ stationId });
  }
}
