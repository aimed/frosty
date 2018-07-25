import { Args, ArgsType, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { EmailPasswordPair, OAuth, UserAccessToken } from '../auth/OAuth';

import { AccessToken } from '../auth/AccessToken';
import { Context } from '../graphql/Context';
import { GraphQLBoolean } from 'graphql';
import { IsEmail } from 'class-validator';
import { Service } from 'typedi';
import { User } from './User';

@Service()
@Resolver(User)
export class UserResolver {
  public constructor(
  ) {}

  @Query(response => User, { nullable: true, description: 'The currently authenticated user.' })
  public viewer(@Ctx() context: Context): User | null {
    return context.user || null;
  }

}
