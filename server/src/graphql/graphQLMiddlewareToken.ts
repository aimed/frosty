import { Context } from './Context';
import { IMiddleware } from 'graphql-middleware/dist/types';
import { Token } from 'typedi';

/**
 * Utility to use DI in middlewares.
 */
export interface GraphQLMiddleware {
  /**
   * The function that serves at the middleware.
   */
  middleware: IMiddleware<any, Context>;
}
export const graphQLMiddlewareToken = new Token<GraphQLMiddleware>('graphQLMiddleware');
