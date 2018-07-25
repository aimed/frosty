import { Arg, Args, ArgsType, Field, Mutation, Query, Resolver } from 'type-graphql';
import { EmailPasswordPair, OAuth } from './OAuth';

import { AccessToken } from './AccessToken';
import { Config } from '../config/Config';
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
          You can log in at ${Config.get('FROSTY_URL')} or reset your password if you forgot it.
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

  @Query(
    type => GraphQLBoolean,
    { description: `Sends a password reset link to the user.` },
  )
  public async requestPasswordReset(@Arg('email') email: string): Promise<boolean> {
    const expiringToken = await this.oauth.createUserResetPasswordToken(email);
    if (expiringToken) {
      await this.mailer.send({
        from: Mailer.DefaultFromAddress,
        to: email,
        subject: `Your frosty password reset attempt`,
        text: `\
            Hello ${email},
            it looks like you or someone else tried to reset a password for a frosty account.
            To do so follow the reset link below. Beware that the link is only valid for 10 minutes.

            ${Config.get('FROSTY_URL')}/reset-password/?token=\
${encodeURIComponent(expiringToken.token)}
          `,
      });
    } else {
      await this.mailer.send({
        from: Mailer.DefaultFromAddress,
        to: email,
        subject: `Your frosty password reset attempt`,
        text: `\
            Hello ${email},
            it looks like you or someone else tried to reset a password for a frosty account.
            Unfortunately no account with your email address exists.
            You can create a new account at ${Config.get('FROSTY_URL')}
          `,
      });
    }
    return true;
  }

  @Query(
    type => GraphQLBoolean,
    { description: `Resets the users password with the given reset token.` },
  )
  public async resetPasswordWithToken(
    @Arg('token') token: string,
    @Arg('password') password: string,
  ): Promise<boolean> {
    const user = await this.oauth.userResetPassword(token, password);
    if (user) {
      await this.mailer.send({
        from: Mailer.DefaultFromAddress,
        to: user.email,
        subject: `Frosty password reset`,
        text: `Hello ${user.email}, your frosty password has been reset.`,
      });
    }
    return !!user;
  }
}
