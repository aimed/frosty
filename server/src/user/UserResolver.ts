import { Ctx, Query, Resolver } from 'type-graphql';

import { Context } from '../graphql/Context';
import { Service } from 'typedi';
import { User } from './User';

@Service()
@Resolver(User)
export class UserResolver {
  public constructor(
  ) {}

  @Query(() => User, { nullable: true, description: 'The currently authenticated user.' })
  public viewer(@Ctx() context: Context): User | null {
    return context.user || null;
  }
}
