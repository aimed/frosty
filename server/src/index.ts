import 'reflect-metadata';

import * as helmet from 'helmet';

import { Db, MongoClient } from 'mongodb';
import { Request, Response } from 'express-serve-static-core';
import { buildSchema, useContainer as typeGraphQLUseContainer } from 'type-graphql';

import { AuthMiddleware } from './graphql/AuthMiddleware';
import { Config } from './config/Config';
import { Container } from 'typedi';
import { GraphQLServer } from 'graphql-yoga';
import { Mailer } from './mail/Mailers';
import { SendGridMailer } from './mail/SendGridMailer';
import { User } from './user/User';
import { UserResolver } from './user/UserResolver';
import { authChecker } from './auth/AuthChecker';
import { buildContext } from './graphql/Context';
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

  const helmetConfig: helmet.IHelmetConfiguration = {
    // contentSecurityPolicy: { directives: { defaultSrc: ['\'self\''], styleSrc: ['\'self\''] } },
  };
  app.use(helmet(helmetConfig));

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
    resolvers: [UserResolver],
  });

  Container.import([
    AuthMiddleware,
  ]);
  const middlewares = Container.getMany(graphQLMiddlewareToken).map(mw => mw.fnc);

  const app = new GraphQLServer({
    schema,
    middlewares,
    context: buildContext,
  });

  app.get('/', (req: Request, res: Response) => {
    res.redirect(playgroundUrl);
  });

  return app;
}

function configureMailer() {
  Container.set(Mailer, new SendGridMailer());
}

async function configureDatabase() {
  const client = await MongoClient.connect(Config.get('MONGO_DB_URL'), { useNewUrlParser: true });
  const database = client.db();
  await database.createCollection<User>(User.name);
  Container.set(Db, database);
}
