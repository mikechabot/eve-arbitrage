import 'reflect-metadata';

import fs from 'fs';
import https from 'https';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection, getCustomRepository } from 'typeorm';

import { ormConfig } from 'src/orm-config';

import {
  migrateInvCategories,
  migrateInvGroups,
  migrateInvTypes,
  migrateStations,
} from 'src/utils/data';

import { InvTypeResolver } from 'src/resolvers/InvTypeResolver';
import { InvGroupResolver } from 'src/resolvers/InvGroupResolver';
import { InvCategoryResolver } from 'src/resolvers/InvCategoryResolver';

import { EsiService } from 'src/services/lib/esi-service';
import { EveLoginService } from 'src/services/lib/eve-login-service';
import { AuthTokenService } from 'src/services/lib/auth-token-service';
import { EveAuthService } from 'src/services/lib/eve-auth-service';
import { EveCharacterService } from 'src/services/lib/eve-character-service';
import { EsiCharacterService } from 'src/services/lib/esi-character-service';
import { EsiCorporationService } from 'src/services/lib/esi-corporation-service';

import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';
import { StationRepository } from 'src/repositories/StationRepository';
import { ItemTypeRepository } from 'src/repositories/ItemTypeRepository';

import { AuthRouter } from 'src/routers/AuthRouter';
import { AssetsRouter } from 'src/routers/AssetsRouter';

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
  await migrateStations();

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

  const authTokenRepository = getCustomRepository(AuthTokenRepository);
  const stationRepository = getCustomRepository(StationRepository);
  const itemTypeRepository = getCustomRepository(ItemTypeRepository);

  const esiService = new EsiService();
  const eveLoginService = new EveLoginService();

  const authTokenService = new AuthTokenService({ authTokenRepository });
  const eveAuthService = new EveAuthService({ eveLoginService });
  const eveCharacterService = new EveCharacterService({ eveLoginService });
  const esiCorporationService = new EsiCorporationService({ esiService });
  const esiCharacterService = new EsiCharacterService({
    esiService,
    itemTypeRepository,
    stationRepository,
  });

  app.use(
    '/auth',
    new AuthRouter({ authTokenService, eveAuthService, eveCharacterService }).router,
  );
  app.use(
    '/assets',
    new AssetsRouter({ authTokenService, esiCharacterService, esiCorporationService }).router,
  );

  app.get('/favico.ico', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'assets', 'myfavico.ico'));
  });

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
