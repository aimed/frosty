import 'reflect-metadata';

import * as helmet from 'helmet';

import { Connection, createConnection, useContainer as typeOrmUseContainer } from 'typeorm';
import { buildSchema, useContainer as typeGraphQLUseContainer } from 'type-graphql';

import { AuthChecker } from './auth/AuthChecker';
import { AuthenticationResolver } from './auth/AuthenticationResolver';
import { Config } from './config/Config';
import { Container } from 'typedi';
import { FridgeResolver } from './fridge/FridgeResolver';
import { GraphQLServer } from 'graphql-yoga';
import { IngredientResolver } from './ingredient/IngredientResolver';
import { Mailer } from './mail/Mailers';
import { Response } from 'express-serve-static-core';
import { SendGridMailer } from './mail/SendGridMailer';
import { UserResolver } from './user/UserResolver';
import { buildContext } from './graphql/Context';
import { getEntities } from './entities';
import { graphQLMiddlewareToken } from './graphql/graphQLMiddlewareToken';

/**
 * Entry point of the application.
 */
bootstrap()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function bootstrap() {
  await configureDatabase();
  configureMailer();

  const { app, startParams } = await configureServer();

  app.start(
    startParams,
    info => console.log(`\
      Server running on port ${info.port} and playground is available at \
      http://localhost:${info.port}${info.playground}
    `),
  );
}

async function configureServer() {
  typeGraphQLUseContainer(Container);
  const authChecker = Container.get(AuthChecker);
  const schema = await buildSchema({
    authChecker: authChecker.check,
    resolvers: [
      UserResolver,
      AuthenticationResolver,
      FridgeResolver,
      IngredientResolver,
    ],
  });

  // Defined middleware
  Container.import([
  ]);

  // Create middleware functions
  const middlewares = Container
    .getMany(graphQLMiddlewareToken)
    .map(middlewareContainer => middlewareContainer.middleware);

  const app = new GraphQLServer({
    schema,
    middlewares,
    context: buildContext,
  });

  // Configure helmet
  const helmetConfig: helmet.IHelmetConfiguration = {
    // TODO: disbaled for now, because playground has many external dependencies
    // contentSecurityPolicy: { directives: { defaultSrc: ['\'self\''], styleSrc: ['\'self\''] } },
  };
  app.use(helmet(helmetConfig));

  // By default redirect to the playground as long as no frontend is implemented
  const playgroundUrl = Config.get('PLAYGROUND_URL', '/playground');
  app.get('/', (res: Response) => {
    res.redirect(playgroundUrl);
  });

  const startParams = {
    port: process.env.PORT || 8000,
    playground: playgroundUrl,
    endpoint: '/graphql',
  };

  return { app, startParams };
}

function configureMailer() {
  Container.set(Mailer, new SendGridMailer());
}

async function configureDatabase() {
  typeOrmUseContainer(Container);
  const connectionString = Config.get('SQLITE_URL');
  const connection = await createConnection({
    type: 'sqlite',
    database: connectionString,
    entities: getEntities(),
    synchronize: true,
    logging: ['query', 'error'],
  });
  Container.set(Connection, connection);
}
