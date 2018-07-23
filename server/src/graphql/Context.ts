import { ContextCallback, Context as GraphQLContext } from 'graphql-yoga/dist/types';
import { Request, Response } from 'express';

import { User } from '../user/User';

/**
 * The context required before any middlewares have been applied.
 */
export interface GraphQLContextPreMiddleware extends GraphQLContext {
  request: Request;
  response: Response;
}

/**
 * Properties added to the context by middlewares.
 */
export interface GraphQLContextMiddlewareExtension {
  user?: User | null;
}

/**
 * Context used for GraphQL requests.
 * Middlewares have been applied to this context.
 */
export interface Context extends GraphQLContextPreMiddleware, GraphQLContextMiddlewareExtension {
}

/**
 * Creates a context instance as required by the middleware.
 * @param params The context parameters passed by the graphql server framework.
 */
export const buildContext: ContextCallback = (params): GraphQLContextPreMiddleware => ({
  ...params,
});
