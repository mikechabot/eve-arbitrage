import 'reflect-metadata';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { ormConfig } from './orm-config';

import { InvTypeResolver } from './resolvers/InvTypeResolver';
import { InvGroupResolver } from './resolvers/InvGroupResolver';
import { InvCategoryResolver } from './resolvers/InvCategoryResolver';

import { migrateInvCategories, migrateInvGroups, migrateInvTypes } from './util/data';

const main = async () => {
  /**
   * Initiate connection to Postgres
   */
  await createConnection(ormConfig);

  /**
   * Migrate EVE data
   */
  await migrateInvTypes();
  await migrateInvGroups();
  await migrateInvCategories();

  /**
   * Create the Express server, which exposes a listening port
   */
  const app = express();

  /**
   * Create the ApolloServer, which exposes GraphQL endpoints
   */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [InvTypeResolver, InvGroupResolver, InvCategoryResolver],
      // Uses something like class validator package, and not very useful
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  /**
   * Start the ApolloServer
   */
  await apolloServer.start();

  /**
   * Attach ApolloServer to Express
   */
  apolloServer.applyMiddleware({ app });

  /**
   * Open the Express port for connections
   */
  return new Promise((resolve, reject) => {
    app
      .listen(3000, () => {
        resolve('Listening on port 3000');
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
};

main()
  .then((msg) => {
    console.log(msg);
  })
  .catch((e) => {
    console.error('Error starting Express', e);
  });
