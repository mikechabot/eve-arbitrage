import fs from 'fs';
import path from 'path';
import { parse } from '@fast-csv/parse';
import { getRepository } from 'typeorm';

import { CsvFilename, StreamEvent } from '../constants';

import { InvType } from '../entities/InvType';
import { InvGroup } from '../entities/InvGroup';
import { InvCategory } from '../entities/InvCategory';

/**
 * Load a CSV given a filepath, and invoke a callback when the row is parsed
 * @param filepath
 * @param insertCb
 */
export const insertFromCsv = (filepath: string, insertCb: (chunk: any) => void) => {
  fs.createReadStream(filepath)
    .pipe(parse({ headers: true }))
    .on(StreamEvent.Error, (error) => console.error(error))
    .on(StreamEvent.Data, insertCb);
};

/**
 * Migrate inventory categories
 */
export const migrateInvCategories = async () => {
  const categoriesRepository = getRepository(InvCategory);
  const categoryCount = await categoriesRepository.count();

  if (categoryCount === 0) {
    const categoriesCsv = path.resolve(__dirname, 'csv', CsvFilename.Category);
    insertFromCsv(categoriesCsv, ({ categoryId, categoryName }) => {
      categoriesRepository.insert({ categoryId, categoryName });
    });
  }
};

/**
 * Migrate inventory groups
 */
export const migrateInvGroups = async () => {
  const groupsRepository = getRepository(InvGroup);
  const groupsCount = await groupsRepository.count();

  if (groupsCount === 0) {
    const groupsCsv = path.resolve(__dirname, 'csv', CsvFilename.Group);
    insertFromCsv(groupsCsv, ({ groupId, categoryId, groupName }) => {
      groupsRepository.insert({ groupId, categoryId, groupName });
    });
  }
};

/**
 * Migrate inventory types
 */
export const migrateInvTypes = async () => {
  const typesRepository = getRepository(InvType);
  const typesCount = await typesRepository.count();

  if (typesCount === 0) {
    const typesCsv = path.resolve(__dirname, 'csv', CsvFilename.Type);
    insertFromCsv(typesCsv, ({ typeId, groupId, typeName }) => {
      typesRepository.insert({ typeId, groupId, typeName });
    });
  }
};
