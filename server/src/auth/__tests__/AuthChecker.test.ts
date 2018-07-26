import 'reflect-metadata';

import { AuthChecker } from '../AuthChecker';
import { Container } from '../../../node_modules/typedi';
import { Context } from '../../graphql/Context';
import { ResolverData } from 'type-graphql';
import { User } from '../../user/User';

describe('authChecker', () => {
  // it('should verify a context with an user object ', () => {
  //   const dataWithUser = {
  //     context: { user: new User() },
  //   } as ResolverData<Context>;
  //   const isAuthorized = authChecker(dataWithUser, []);
  //   expect(isAuthorized).toEqual(true);
  // });

  // it('should not verify a context with no user object ', () => {
  //   const dataWithUser = {
  //     context: { user: null },
  //   } as ResolverData<Context>;
  //   const isAuthorized = authChecker(dataWithUser, []);
  //   expect(isAuthorized).toEqual(false);
  // });
  const checker = new AuthChecker();

  it('should accept a context with a user object', async () => {
    const result = await checker.check({ context: { user: new User() } } as any, []);
    expect(result).toBeTruthy();
  });

  // TODO: Complete tests.
});
