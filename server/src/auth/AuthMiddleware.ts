import { Context, GraphQLContextPreMiddleware } from '../graphql/Context';
import { GraphQLMiddleware, graphQLMiddlewareToken } from '../graphql/graphQLMiddlewareToken';

import { IMiddleware } from 'graphql-middleware';
import { OAuth } from './OAuth';
import { Service } from 'typedi';

@Service({ id: graphQLMiddlewareToken, multiple: true })
export class AuthMiddleware implements GraphQLMiddleware {
  public constructor(
    private readonly oauth: OAuth,
  ) {}

  public middleware: IMiddleware<any, Context> =
    async (resolve, source, args, context, info) => {
      // The middleware gets applied to every field, we thus need to check if user has already been
      // set.
      if (context.user !== undefined) {
        return resolve(source, args, context, info);
      }
      const request = context.request;
      const token = this.oauth.accessTokenForRequest(request);
      const user = await this.oauth.getUser(token);
      const nextContext = { ...context, user };
      return resolve(source, args, nextContext, info);
    }
}
