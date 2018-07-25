import { Args, ArgsType, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { EmailPasswordPair, OAuth, UserAccessToken } from './OAuth';

import { AccessToken } from './AccessToken';
import { GraphQLBoolean } from 'graphql';
import { IsEmail } from 'class-validator';
import { Mailer } from '../mail/Mailers';
import { Service } from 'typedi';
import { User } from '../user/User';

@ArgsType()
class RegisterArgs implements EmailPasswordPair {
  @Field()
  @IsEmail()
  public readonly email!: string;

  @Field()
  public readonly password!: string;
}

@ArgsType()
class AccessTokenArgs implements EmailPasswordPair {
  @Field()
  @IsEmail()
  public readonly email!: string;

  @Field()
  public readonly password!: string;
}

@Service()
@Resolver()
export class OAuthResolver {
  constructor(
    private readonly oauth: OAuth,
    private readonly mailer: Mailer,
  ) {
  }

  /**
   * IMPORTANT: Always return to to prevent user enumeration/leaking.
   */
  @Mutation(type => GraphQLBoolean, { description: 'Registers an user with the app.' })
  public async register(@Args() args: RegisterArgs): Promise<boolean> {
    const { email } = args;
    const hasUserWithEmail = await this.oauth.findUserByEmail(email);
    if (hasUserWithEmail) {
      await this.mailer.send({
        from: Mailer.DefaultFromAddress,
        to: email,
        subject: `Your registration at frosty`,
        text: `
          Hello ${email},
          you tried to sign up for a frosty account, but we noticed that an account with your email\
          already exists.
          You can log in at https://frosty.norocketlab.net/ or reset your password if you forgot it.
        `,
      });
      return true;
    }

    await this.oauth.createUser(args);
    await this.mailer.send({
      from: Mailer.DefaultFromAddress,
      to: email,
      subject: `Your registration at frosty`,
      text: `\
        Hello ${email},
        thanks for signing up with frosty!\
      `,
    });
    return true;
  }

  @Query(
    type => AccessToken,
    {
      description: `
        Get an access token for a email password pair. If null is returned the
        authentication failed.
      `,
      nullable: true,
    },
  )
  public async accessToken(@Args() args: AccessTokenArgs): Promise<AccessToken | null> {
    return await this.oauth.createUserCredentialsAccessToken(args);
  }
}
