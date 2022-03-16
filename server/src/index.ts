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
import { OauthTokenService } from 'src/services/lib/oauth-token-service';
import { EveAuthService } from 'src/services/lib/eve-auth-service';
import { EveCharacterService } from 'src/services/lib/eve-character-service';
import { EsiCharacterService } from 'src/services/lib/esi-character-service';
import { EsiCorporationService } from 'src/services/lib/esi-corporation-service';

import { AuthTokenRepository } from 'src/repositories/AuthTokenRepository';
import { StationRepository } from 'src/repositories/StationRepository';
import { ItemTypeRepository } from 'src/repositories/ItemTypeRepository';

import { AuthRouter } from 'src/routers/AuthRouter';
import { AssetsRouter } from 'src/routers/AssetsRouter';
import { StructureRepository } from 'src/repositories/StructureRepository';
import { EsiStructureService } from 'src/services/lib/esi-structure-api';
import { CharacterRouter } from 'src/routers/CharacterRouter';

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

  /**
   * Allow cookie parsing
   */
  app.use(cookieParser());

  /**
   * Initialize repositories
   */
  const authTokenRepository = getCustomRepository(AuthTokenRepository);
  const stationRepository = getCustomRepository(StationRepository);
  const itemTypeRepository = getCustomRepository(ItemTypeRepository);
  const structureRepository = getCustomRepository(StructureRepository);

  /**
   * Initialize Eve services
   */
  const esiService = new EsiService();
  const eveLoginService = new EveLoginService();

  /**
   * Initialize our services
   */
  const oauthTokenService = new OauthTokenService({ authTokenRepository });
  const eveAuthService = new EveAuthService({ eveLoginService });
  const eveCharacterService = new EveCharacterService({ eveLoginService });
  const esiStructureService = new EsiStructureService({ esiService });
  const esiCorporationService = new EsiCorporationService({ esiService });
  const esiCharacterService = new EsiCharacterService({
    esiService,
    esiStructureService,
    itemTypeRepository,
    stationRepository,
    structureRepository,
  });

  /**
   * Initialize express API routers
   */
  const { router: assetsRouter } = new AssetsRouter({ oauthTokenService, esiCharacterService });
  const { router: authRouter } = new AuthRouter({
    oauthTokenService,
    eveAuthService,
    eveCharacterService,
  });
  const { router: meRouter } = new CharacterRouter({
    oauthTokenService,
    esiCharacterService,
    esiCorporationService,
  });

  /**
   * Attach the router to express
   */
  app.use('/me', meRouter);
  app.use('/auth', authRouter);
  app.use('/assets', assetsRouter);

  /**
   * Handle favicon
   */
  app.get('/favico.ico', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'assets', 'myfavico.ico'));
  });

  /**
   * Handle 404s
   */
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404);
    return next(new Error(`'Not Found: ${req.originalUrl}`));
  });

  /**
   * Handle 500s
   */
  app.use((error: Error, _: Request, res: Response) => {
    res.status(500);
    res.json(error);
  });

  /**
   * Open the Express port for connections
   */
  return new Promise((resolve, reject) => {
    /**
     * Create HTTPs server
     */
    const apiServer = https.createServer(
      {
        key: fs.readFileSync('src/cert/key.pem'),
        cert: fs.readFileSync('src/cert/cert.pem'),
        passphrase: 'Hax0r123!',
      },
      app,
    );

    /**
     * Open the port and being listening
     */
    apiServer
      .listen(4000, () => {
        resolve('Listening on port 4000');
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
};

startServer()
  .then(console.log)
  .catch((e) => {
    console.error('Error starting Express', e);
  });
