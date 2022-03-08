import { ConnectionOptions } from 'typeorm';
import { Rant } from './entities/Rant';
import { __prod__ } from './constants';

export const ormConfig: ConnectionOptions = {
  type: 'postgres',
  database: 'quickrant',
  username: 'postgres',
  password: 'Hax0r123!',
  logging: !__prod__,
  entities: [Rant],
  /**
   * Don't use this in production as it recreates the schema
   * on every application launch, meaning in prod we would
   * lose data.
   */
  synchronize: true,
};
