export const __prod__ = process.env.NODE_ENV === 'production';

export const StreamEvent = {
  Error: 'error',
  Data: 'data',
};

export const CsvFilename = {
  Category: 'invCategories.csv',
  Group: 'invGroups.csv',
  Type: 'invTypes.csv',
};
