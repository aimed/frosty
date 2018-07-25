import { DeepPartial, FindOneOptions, MoreThan, Repository } from 'typeorm';

import { AccessToken } from './AccessToken';
import { Crypto } from './Crypto';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Request } from 'express';
import { ResetPasswordToken } from './ResetPasswordToken';
import { Service } from 'typedi';
import { User } from '../user/User';

export interface EmailPasswordPair {
  email: string;
  password: string;
}

export interface ExpiringToken {
  token: string;
  validUntil: number;
}

@Service()
export class OAuth {
  private static readonly ONE_MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

  public constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepo: Repository<AccessToken>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(ResetPasswordToken)
    private readonly resetPasswordTokenRepo: Repository<ResetPasswordToken>,
  ) {
  }

  /**
   * Returns the token on the request.
   * Token should be defined on the header, example: "Authorization: Bearer my_token".
   * @param req An express request object.
   */
  public accessTokenForRequest(req: Request): string | undefined {
    const authHeader = req.header('authorization');
    if (authHeader && authHeader.length) {
      // Header example:
      // Authorization: Bearer my_token
      const segments = authHeader.split(' ');
      if (segments.length > 1) {
        return segments[1];
      }
    }
    return undefined;
  }

  /**
   * Creates an access token for the given email password pair if it is valid, otherwise return
   * null.
   * @param emailPasswordPair The users email and plain text password.
   */
  public async createUserCredentialsAccessToken(
    emailPasswordPair: EmailPasswordPair,
  ): Promise<AccessToken | null> {
    const user = await this.authenticate(emailPasswordPair);

    if (user === null) {
      return null;
    }

    return this.createAccessToken(user);
  }

  /**
   * If the access token is valid returns the user, otherwise returns null.
   * @param token The bearer token.
   */
  public async getUser(token: string | null | undefined): Promise<User | null> {
    if (!token) {
      return null;
    }

    const minValidUntil = Date.now();
    const query: FindOneOptions<AccessToken> = {
      where: { token, validUntil: MoreThan(minValidUntil) },
      cache: 30 * 1000, // Cache access tokens for 30 seconds for subsequent requests.
    };
    const tokenResult = await this.accessTokenRepo.findOne(query);

    if (!tokenResult) {
      return null;
    }
    return tokenResult.user;
  }

  /**
   * Creates an access token for the given user and the given alidity period.
   */
  public async createAccessToken(
    user: User,
    validFor: number = OAuth.ONE_MONTH_IN_MS,
  ): Promise<AccessToken> {
    const token: string = await Crypto.randomToken();
    const validUntil: number = Date.now() + validFor;
    const instance = this.accessTokenRepo.create({ token, user, validUntil });
    return this.accessTokenRepo.save(instance);
  }

  /**
   * For a valid email password pair returns the user, otherwise null.
   */
  public async authenticate(
    emailPasswordPair: EmailPasswordPair,
  ): Promise<User | null> {
    const { email, password } = emailPasswordPair;
    const user = await this.userRepo.findOne({ email });

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await Crypto.isPasswordCorrect(password, user.password);
    if (isPasswordCorrect) {
      return user;
    }

    return null;
  }

  /**
   * Creates a user instance and hashes the password.
   * @param user The user properties.
   */
  public async createUser(user: DeepPartial<User> & EmailPasswordPair): Promise<User> {
    const plaintextPassword = user.password;
    const hashedPassword = await Crypto.hashPassword(plaintextPassword);
    const instance = this.userRepo.create({ ...user, password: hashedPassword });
    return this.userRepo.save(instance);
  }

  /**
   * Creates a password reset token that can be used to reset a users password.
   * Returns the token if operation was successfull (user exists and token has been created),
   * otherwise returns null.
   *
   * IMPORTANT: SECURITY: In order to prevent unauthorized password resets, the token is stored
   * encrypted using the global pepper.
   * Furthermore the validity duration should be limited to a reasonable timeframe.
   * See:
   * https://postmarkapp.com/guides/password-reset-email-best-practices#secure-password-reset-emails
   * @param email The users email.
   * @param validFor The validity of the token.
   */
  public async createUserResetPasswordToken(
    email: string,
    validFor: number =  1000 * 60 * 10 /* 10 minutes */,
  ): Promise<ExpiringToken | null> {
    const user = await this.userRepo.findOne({ email });
    if (!user) {
      return null;
    }

    const token = await Crypto.randomToken();
    const validUntil = Date.now() + validFor;
    const instance = this.resetPasswordTokenRepo.create({ token, user, validUntil });
    await this.resetPasswordTokenRepo.save(instance);
    const encryptedToken = Crypto.encryptAes265(token);
    return {
      validUntil,
      token: encryptedToken,
    };
  }

  /**
   * Resets a users password using the given token.
   * @param encryptedToken The encrypted reset token.
   * @param plaintextPassword The new user password in plaintext.
   */
  public async userResetPassword(
    encryptedToken: string,
    plaintextPassword: string,
  ): Promise<boolean> {
    // TODO: Delete all old tokens
    const validUntil = Date.now();
    const token = Crypto.decryptAes265(encryptedToken);
    const query = { where: { token, validUntil: MoreThan(validUntil) } };
    const tokenInstance = await this.resetPasswordTokenRepo.findOne(query);
    if (!tokenInstance || !tokenInstance.user) {
      return false;
    }
    const password = await Crypto.hashPassword(plaintextPassword);
    await this.userRepo.update({ id: tokenInstance.user.id }, { password });
    await this.resetPasswordTokenRepo.delete({ token });
    return true;
  }

  // TODO: TEST
  /**
   * Deleted the given user. Returns true if success.
   * @param user The user to delete.
   */
  // public async userDelete(user: User): Promise<boolean> {
  //   const result = await this.userCollection.deleteOne({ _id: user.id });
  //   return !!result.deletedCount;
  // }
}
