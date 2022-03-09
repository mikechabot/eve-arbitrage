import 'reflect-metadata';

import fs from 'fs';
import https from 'https';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { ormConfig } from './orm-config';
import { AuthRouter } from './routers/AuthRouter';

import { InvTypeResolver } from './resolvers/InvTypeResolver';
import { InvGroupResolver } from './resolvers/InvGroupResolver';
import { InvCategoryResolver } from './resolvers/InvCategoryResolver';

import { migrateInvCategories, migrateInvGroups, migrateInvTypes } from './util/data';
import { AssetsRouter } from './routers/AssetsRouter';

const startServer = async () => {
  /**
   * Initiate connection to Postgres
   */
  await createConnection(ormConfig);

  /**
   * Migrate static EVE data
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

  const whitelist = ['https://localhost:3000'];

  /**
   * Configure CORS. Allow only whitelisted hosts.
   */
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    }),
  );

  app.use('/auth', AuthRouter);
  app.use('/assets', AssetsRouter);

  app.use('/', (_, res) => {
    res.send('Welcome to eve-arbitrage');
  });

  /**
   * Open the Express port for connections
   */
  return new Promise((resolve, reject) => {
    const apiServer = https.createServer(
      {
        key: fs.readFileSync('src/cert/key.pem'),
        cert: fs.readFileSync('src/cert/cert.pem'),
        passphrase: 'Hax0r123!',
      },
      app,
    );

    apiServer
      .listen(4000, () => {
        resolve('Listening on port 3000');
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
};

startServer()
  .then((msg) => {
    console.log(msg);
  })
  .catch((e) => {
    console.error('Error starting Express', e);
  });
