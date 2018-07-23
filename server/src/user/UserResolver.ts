import { Args, ArgsType, Ctx, Field, Mutation, Query, Resolver } from 'type-graphql';
import { Authentication, EmailPasswordPair } from '../auth/Authentication';

import { AccessToken } from '../auth/AccessToken';
import { Context } from '../graphql/Context';
import { GraphQLBoolean } from 'graphql';
import { IsEmail } from 'class-validator';
import { OAuth } from '../auth/OAuth';
import { Service } from 'typedi';
import { User } from './User';

@ArgsType()
export class RegisterArgs implements EmailPasswordPair {
  @Field()
  @IsEmail()
  public readonly email!: string;

  @Field()
  public readonly password!: string;
}

@ArgsType()
export class AccessTokenArgs implements EmailPasswordPair {
  @Field()
  @IsEmail()
  public readonly email!: string;

  @Field()
  public readonly password!: string;
}

@Service()
@Resolver(User)
export class UserResolver {
  public constructor(
    private readonly authService: Authentication,
    private readonly oauth: OAuth,
  ) {}

  @Query(response => User, { nullable: true, description: 'The currently authenticated user.' })
  public viewer(@Ctx() context: Context): User | null {
    return context.user || null;
  }

  @Mutation(type => GraphQLBoolean, { description: 'Registers an user with the app.' })
  public async register(
    @Args() args: RegisterArgs,
  ): Promise<boolean> {
    await this.authService.register(args);
    // IMPORTANT: As seen in AuthService, we never reveal if the operation was successful or not to
    //            prevent account enumeration.
    return true;
  }

  @Query(
    type => AccessToken,
    {
      description: `
        Get an access token for a email password pair. If null is returned the
        authentication failed.
      `,
    },
  )
  public async accessToken(
    @Args() args: AccessTokenArgs,
  ): Promise<AccessToken | null> {
    const tokenAndUser = await this.oauth.userCredentialsAccessToken(args);
    if (tokenAndUser) {
      return tokenAndUser.token;
    }
    return null;
  }
}
