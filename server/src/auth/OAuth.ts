import { DeepPartial, FindOneOptions, MoreThan, Repository } from 'typeorm';

import { AccessToken } from './AccessToken';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PasswordResetToken } from './PasswordResetToken';
import { Request } from 'express';
import { Security } from './Security';
import { Service } from 'typedi';
import { User } from '../user/User';

export interface EmailPasswordPair {
  email: string;
  password: string;
}

@Service()
export class OAuth {
  private static readonly ONE_MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

  public constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepo: Repository<AccessToken>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(PasswordResetToken)
    private readonly resetPasswordTokenRepo: Repository<PasswordResetToken>,
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
      if (segments.length > 1 && segments[0] === 'Bearer') {
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

  public findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ email });
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
    const token: string = await Security.randomToken();
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

    const isPasswordCorrect = await Security.isPasswordCorrect(password, user.password);
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
    const hashedPassword = await Security.hashPassword(plaintextPassword);
    const instance = this.userRepo.create({ ...user, password: hashedPassword });
    return this.userRepo.save(instance);
  }
  // public async userDelete()
}
