import { Inject, Service } from '../../node_modules/typedi';

import { Context } from '../graphql/Context';
import { AuthChecker as GraphlQLAuthChecker } from 'type-graphql';
import { OAuth } from './OAuth';

@Service()
export class AuthChecker {
  @Inject()
  private readonly oauth!: OAuth;

  public check: GraphlQLAuthChecker<Context> = async ({ context }, roles) => {
    const user = await this.getUser(context);
    if (!user) {
      return false;
    }

    context.user = user;

    if (roles.length === 0) {
      return true;
    }

    const userRoles = await user.roles;
    const userRolesMap = userRoles.reduce(
      (dict, role) => ({ ...dict, [role.name]: role.name }), {});
    const missingRoles = roles.filter(role => !(role in userRolesMap));
    return missingRoles.length > 0;
  }

  private async getUser(context: Context) {
    if (context.user) {
      return context.user;
    }
    const request = context.request;
    const token = this.oauth.accessTokenForRequest(request);
    const user = await this.oauth.getUser(token);
    return user;
  }
}
