import 'reflect-metadata';

import { Context } from '../../graphql/Context';
import { ResolverData } from 'type-graphql';
import { User } from '../../user/User';
import { authChecker } from '../AuthChecker';

describe('authChecker', () => {
  it('should verify a context with an user object ', () => {
    const dataWithUser = {
      context: { user: new User() },
    } as ResolverData<Context>;
    const isAuthorized = authChecker(dataWithUser, []);
    expect(isAuthorized).toEqual(true);
  });

  it('should not verify a context with no user object ', () => {
    const dataWithUser = {
      context: { user: null },
    } as ResolverData<Context>;
    const isAuthorized = authChecker(dataWithUser, []);
    expect(isAuthorized).toEqual(false);
  });
});
