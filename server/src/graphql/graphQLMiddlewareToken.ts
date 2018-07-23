import { IMiddleware } from 'graphql-middleware/dist/types';
import { Token } from 'typedi';

export interface GraphQLMiddleware {
  fnc: IMiddleware;
}
export const graphQLMiddlewareToken = new Token<GraphQLMiddleware>('graphQLMiddleware');
