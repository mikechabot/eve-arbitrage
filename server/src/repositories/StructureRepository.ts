import { EntityRepository, Repository } from 'typeorm';

import { Structure } from 'src/entities/Structure';
import { EveStructureApiV2 } from 'src/services/types/structure-api';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * This handles player-owned structures
 */
@EntityRepository(Structure)
export class StructureRepository extends Repository<Structure> {
  insertStructure(locationId: number, structure: EveStructureApiV2) {
    console.log('Inserting', locationId);
    const partial: QueryDeepPartialEntity<Structure> = {
      locationId,
      name: structure.name,
      typeId: structure.type_id,
      ownerId: structure.owner_id,
      solarSystemId: structure.solar_system_id,
    };

    return this.insert(partial);
  }

  findStructureByLocationId(locationId: number): Promise<Structure | undefined> {
    return this.findOne({ locationId });
  }

  async getStationByLocationIdMap(): Promise<Record<number, Structure>> {
    const structures = await this.find({});

    const structureByLocationId = {} as Record<number, Structure>;
    structures!.forEach((structure) => {
      structureByLocationId[structure.locationId] = structure;
    });

    return structureByLocationId;
  }
}
