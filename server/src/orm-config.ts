import { ConnectionOptions } from 'typeorm';

import { __prod__ } from 'src/constants';

import { InvType } from 'src/entities/InvType';
import { InvGroup } from 'src/entities/InvGroup';
import { InvCategory } from 'src/entities/InvCategory';
import { AuthToken } from 'src/entities/AuthToken';
import { Station } from 'src/entities/Station';

export const ormConfig: ConnectionOptions = {
  type: 'postgres',
  database: 'eve',
  username: 'postgres',
  password: 'Hax0r123!',
  logging: !__prod__,
  entities: [AuthToken, InvGroup, InvType, InvCategory, Station],
  /**
   * Don't use this in production as it recreates the schema
   * on every application launch, meaning in prod we would
   * lose data.
   */
  synchronize: true,
};
