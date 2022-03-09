import { ConnectionOptions } from 'typeorm';

import { __prod__ } from './constants';

import { InvType } from './entities/InvType';
import { InvGroup } from './entities/InvGroup';
import { InvCategory } from './entities/InvCategory';

export const ormConfig: ConnectionOptions = {
  type: 'postgres',
  database: 'eve2',
  username: 'postgres',
  password: 'Hax0r123!',
  logging: !__prod__,
  entities: [InvGroup, InvType, InvCategory],
  migrations: ['dist/migrations/*'],
  /**
   * Don't use this in production as it recreates the schema
   * on every application launch, meaning in prod we would
   * lose data.
   */
   synchronize: true,
};
