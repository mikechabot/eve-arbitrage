import fs from 'fs';
import path from 'path';
import { parse } from '@fast-csv/parse';
import { getRepository } from 'typeorm';

import { CsvFilename, StreamEvent } from 'src/constants';

import { InvType } from 'src/entities/InvType';
import { InvGroup } from 'src/entities/InvGroup';
import { InvCategory } from 'src/entities/InvCategory';
import { Station } from 'src/entities/Station';
// import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * Load a CSV given a filepath, and invoke a callback when the row is parsed
 * @param filepath
 * @param insertCb
 */
export const insertFromCsv = (filepath: string, insertCb: (chunk: any) => void) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(parse({ headers: true }))
      .on(StreamEvent.Error, (error) => {
        console.error(error);
        reject(error);
      })
      .on(StreamEvent.Data, insertCb)
      .on(StreamEvent.Close, resolve);
  });
};

/**
 * Migrate inventory categories
 */
export const migrateInvCategories = async () => {
  const categoriesRepository = getRepository(InvCategory);
  const categoryCount = await categoriesRepository.count();

  // const categories: QueryDeepPartialEntity<InvCategory>[] = [];

  if (categoryCount === 0) {
    const categoriesCsv = path.resolve(__dirname, 'csv', CsvFilename.Category);
    await insertFromCsv(categoriesCsv, ({ categoryId, categoryName }) => {
      categoriesRepository.insert({ categoryId, categoryName });
    });

    // try {
    //   console.log('CATS', categories.length);
    //   await categoriesRepository.insert(categories);
    // } catch (e) {
    //   console.error(e);
    // }
  }
};

/**
 * Migrate inventory groups
 */
export const migrateInvGroups = async () => {
  const groupsRepository = getRepository(InvGroup);
  const groupsCount = await groupsRepository.count();

  // const groups: QueryDeepPartialEntity<InvGroup>[] = [];

  if (groupsCount === 0) {
    const groupsCsv = path.resolve(__dirname, 'csv', CsvFilename.Group);

    await insertFromCsv(groupsCsv, ({ groupId, categoryId, groupName }) => {
      groupsRepository.insert({ groupId, categoryId, groupName });
    });

    // try {
    //   console.log('GROUPS', groups.length);
    //   await groupsRepository.insert(groups);
    // } catch (e) {
    //   console.error(e);
    // }
  }
};

/**
 * Migrate inventory types
 */
export const migrateInvTypes = async () => {
  const typesRepository = getRepository(InvType);
  const typesCount = await typesRepository.count();

  // const types: QueryDeepPartialEntity<InvType>[] = [];

  if (typesCount === 0) {
    const typesCsv = path.resolve(__dirname, 'csv', CsvFilename.Type);
    await insertFromCsv(typesCsv, ({ typeId, groupId, typeName }) => {
      typesRepository.insert({ typeId, groupId, typeName });
    });

    // try {
    //   console.log('TYPES', types.length);
    //   await typesRepository.insert(types);
    // } catch (e) {
    //   console.error(e);
    // }
  }
};

/**
 * Migrate inventory types
 */
export const migrateStations = async () => {
  const stationRepository = getRepository(Station);
  const stationsCount = await stationRepository.count();

  // let stations: QueryDeepPartialEntity<Station>[] = [];

  if (stationsCount === 0) {
    const stationsCsv = path.resolve(__dirname, 'csv', CsvFilename.Station);
    await insertFromCsv(stationsCsv, ({ stationId, security, stationName }) => {
      stationRepository.insert({ stationId, security, stationName });
    });

    // try {
    //   console.log('STATIONS', stations.length);
    //   await stationRepository.insert(stations);
    // } catch (e) {
    //   console.error(e);
    // }
  }
};
