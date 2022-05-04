import { ConnectionOptions } from 'typeorm';

import { __prod__ } from 'src/constants';

import { InvType } from 'src/entities/InvType';
import { InvGroup } from 'src/entities/InvGroup';
import { InvCategory } from 'src/entities/InvCategory';
import { OAuthToken } from 'src/entities/OAuthToken';
import { Station } from 'src/entities/Station';
import { Structure } from 'src/entities/Structure';

export const ormConfig: ConnectionOptions = {
  type: 'postgres',
  database: 'eve-arbitrage',
  username: 'postgres',
  password: 'Hax0r123!',
  logging: false,
  entities: [OAuthToken, InvGroup, InvType, InvCategory, Station, Structure],
  /**
   * Don't use this in production as it recreates the schema
   * on every application launch, meaning in prod we would
   * lose data.
   */
  synchronize: false,
};
