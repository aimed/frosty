import 'reflect-metadata';

import * as helmet from 'helmet';

import { Connection, createConnection, useContainer as typeOrmUseContainer } from 'typeorm';
import { Request, Response } from 'express-serve-static-core';
import { buildSchema, useContainer as typeGraphQLUseContainer } from 'type-graphql';

import { AuthMiddleware } from './auth/AuthMiddleware';
import { Config } from './config/Config';
import { Container } from 'typedi';
import { GraphQLServer } from 'graphql-yoga';
import { Mailer } from './mail/Mailers';
import { OAuthResolver } from './auth/OAuthResolver';
import { SendGridMailer } from './mail/SendGridMailer';
import { UserResolver } from './user/UserResolver';
import { authChecker } from './auth/AuthChecker';
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

  const playgroundUrl = Config.get('PLAYGROUND_URL', '/playground');
  const app = await configureServer(playgroundUrl);

  app.start(
    {
      port: process.env.PORT || 3000,
      playground: playgroundUrl,
    },
    info => console.log(`\
      Server running on port ${info.port} and playground is available at \
      http://localhost:${info.port}${info.playground}
    `),
  );
}

async function configureServer(playgroundUrl: string) {
  typeGraphQLUseContainer(Container);

  const schema = await buildSchema({
    authChecker,
    resolvers: [
      UserResolver,
      OAuthResolver,
    ],
  });

  // Defined middleware
  Container.import([
    AuthMiddleware,
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
  app.get('/', (res: Response) => {
    res.redirect(playgroundUrl);
  });

  return app;
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
  });
  Container.set(Connection, connection);
}
