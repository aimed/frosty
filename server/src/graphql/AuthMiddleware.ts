import { GraphQLMiddleware, graphQLMiddlewareToken } from './graphQLMiddlewareToken';

import { GraphQLContextPreMiddleware } from './Context';
import { IMiddleware } from 'graphql-middleware';
import { OAuth } from '../auth/OAuth';
import { Service } from 'typedi';

@Service({ id: graphQLMiddlewareToken, multiple: true })
export class AuthMiddleware implements GraphQLMiddleware {
  public constructor(
    private readonly oauth: OAuth,
  ) {}

  public fnc: IMiddleware<any, GraphQLContextPreMiddleware, any> =
    async (resolve, source, args, context, info) => {
      const request = context.request;
      const token = this.oauth.accessTokenForRequest(request);
      const user = await this.oauth.userForAccessToken(token);
      const nextContext = { ...context, user };
      return resolve(source, args, nextContext, info);
    }
}
