import { Inject, Service } from 'typedi';

import { Authentication } from './Authentication';
import { Context } from '../graphql/Context';
import { AuthChecker as GraphlQLAuthChecker } from 'type-graphql';
import { Request } from 'express';

@Service()
export class AuthChecker {
  @Inject()
  private readonly oauth!: Authentication;

  /**
   * Authenticates a user based on the request.
   */
  public check: GraphlQLAuthChecker<Context> = async ({ context }, roles) => {
    const user = await this.getUser(context);
    if (!user) {
      return false;
    }

    if (roles.length === 0) {
      return true;
    }

    const userRoles = await user.roles;
    const userRolesMap = userRoles.reduce(
      (dict, role) => ({ ...dict, [role.name]: role.name }), {});
    const missingRoles = roles.filter(role => !(role in userRolesMap));
    return missingRoles.length > 0;
  }

  /**
   * Gets the user from the current request context.
   * Also adds the user ot the context.
   * @param context The request context.
   */
  private async getUser(context: Context) {
    if (context.user) {
      return context.user;
    }

    const request = context.request;
    const token = this.getAccessToken(request);
    const user = await this.oauth.getTokenUser(token);
    context.user = user;
    return user;
  }

  /**
   * Returns the token on the request.
   * Token should be defined on the header, example: "Authorization: Bearer my_token".
   * @param req An express request object.
   */
  public getAccessToken(req: Request): string | undefined {
    const authHeader = req.header('authorization');
    if (authHeader && authHeader.length) {
      // Header example:
      // Authorization: Bearer my_token
      const segments = authHeader.split(' ');
      if (segments.length !== 2) {
        return undefined;
      }

      if (segments[0] === 'Bearer') {
        return segments[1];
      }
    }
    return undefined;
  }
}
