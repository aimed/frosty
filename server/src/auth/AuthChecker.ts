import { AuthChecker } from 'type-graphql';
import { Context } from '../graphql/Context';

/**
 * Authenticates users in graphql requests.
 * @param param0 Arguments passed to the resolver.
 * @param roles The roles to check.
 */
export const authChecker: AuthChecker<Context> = ({ context }, roles) => !!context.user;
