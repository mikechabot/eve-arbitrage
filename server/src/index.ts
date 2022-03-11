import 'reflect-metadata';

import fs from 'fs';
import https from 'https';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { ormConfig } from 'src/orm-config';

import { InvTypeResolver } from 'src/resolvers/InvTypeResolver';
import { InvGroupResolver } from 'src/resolvers/InvGroupResolver';
import { InvCategoryResolver } from 'src/resolvers/InvCategoryResolver';

import { AuthRouter } from 'src/routers/AuthRouter';
import { AssetsRouter } from 'src/routers/AssetsRouter';

import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';

import { migrateInvCategories, migrateInvGroups, migrateInvTypes } from 'src/util/data';

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
      /**
       * Required for the client to make "credentials: include" requests.
       * This also tells the browser to store cookies from the response.
       */
      credentials: true,
      origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    }),
  );

  /**
   * Don't reveal server information
   */
  app.disable('X-Powered-By');
  /**
   * Disable caching
   */
  app.set('etag', false);

  /**
   * Allow JSON to be sent in POST request bodies
   */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(cookieParser());

  const repository = new AuthTokenRepository();

  app.use('/auth', new AuthRouter({ repository }).router);
  app.use('/assets', new AssetsRouter({ repository }).router);

  /**
   * Handle 404s
   */
  app.use((request: Request, response: Response, next: NextFunction) => {
    response.status(404);
    return next(new Error(`'Not Found: ${request.originalUrl}`));
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
