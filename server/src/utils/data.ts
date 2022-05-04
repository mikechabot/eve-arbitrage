import fs from 'fs';
import path from 'path';
import { parse } from '@fast-csv/parse';
import {DeepPartial, EntityTarget, getRepository} from 'typeorm';

import { CsvFilename, StreamEvent } from 'src/constants';

import { InvType } from 'src/entities/InvType';
import { InvGroup } from 'src/entities/InvGroup';
import { InvCategory } from 'src/entities/InvCategory';
import { Station } from 'src/entities/Station';

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
 * Generic migration function that reads data from a CSV and inserts it into a repository
 * @param model
 * @param filename
 */
const migrateData = async <T>(model: EntityTarget<T>, filename: string) => {
  const repository = getRepository(model);
  const count = await repository.count();

  const data: DeepPartial<T>[] = [];

  if (count === 0) {
    console.log(`Reading ${filename}...`);

    const categoriesCsv = path.resolve(__dirname, 'csv', filename);
    await insertFromCsv(categoriesCsv, (vals) => {
      data.push(vals)
    });

    console.log(`   > Found ${data.length}`);
    await repository.save(data, {chunk: 200});
    const cnt = await repository.count();
    console.log(`   > Inserted ${cnt}`);
  } else {
    console.log(`   > No migration required for ${filename}`);
  }
}

/**
 * Migrate inventory categories
 */

export const migrateInvCategories = async () => {
  await migrateData<InvCategory>(InvCategory, CsvFilename.Category)
};

/**
 * Migrate inventory groups
 */
export const migrateInvGroups = async () => {
  await migrateData<InvGroup>(InvGroup, CsvFilename.Group)
};

/**
 * Migrate inventory types
 */
export const migrateInvTypes = async () => {
  await migrateData<InvType>(InvType, CsvFilename.Type)
};

/**
 * Migrate inventory types
 */
export const migrateStations = async () => {
  await migrateData<Station>(Station, CsvFilename.Station)
};
