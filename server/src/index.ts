import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { __prod__ } from './constants';
import { ormConfig } from './orm-config';
import { HelloResolver } from './resolvers/hello';
import { RantResolver } from './resolvers/rant-resolver';

const main = async () => {
  console.log('Running');
  await createConnection(ormConfig);

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, RantResolver],
      // Uses something like class validator package, and not very useful
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

main()
  .then(() => {
    console.log('Complete');
  })
  .catch((e) => {
    console.error(e);
  });

export { main };
