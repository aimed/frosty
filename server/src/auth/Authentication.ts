import { FindOneOptions, MoreThan, Repository } from 'typeorm';

import { AccessToken } from './AccessToken';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { InvalidTokenError } from '../errors/InvalidTokenError';
import { Security } from './Security';
import { Service } from 'typedi';
import { User } from '../user/User';

export interface EmailPasswordPair {
  email: string;
  password: string;
}

@Service()
export class Authentication {
  private static readonly ONE_MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

  @InjectRepository(AccessToken)
  private readonly accessTokenRepo!: Repository<AccessToken>;

  @InjectRepository(User)
  private readonly userRepo!: Repository<User>;

  /**
   * Creates an access token for the given email password pair if it is valid, otherwise return
   * null.
   * @param emailPasswordPair The users email and plain text password.
   */
  public async createUserCredentialsAccessToken(
    emailPasswordPair: EmailPasswordPair,
  ): Promise<AccessToken | null> {
    const user = await this.authenticateUserCredentials(emailPasswordPair);

    if (user === null) {
      return null;
    }

    return this.createAccessToken(user);
  }

  /**
   * If the access token is valid returns the user, otherwise returns null.
   * @param token The bearer token.
   * @throws InvalidTokenError
   */
  public async getTokenUser(token: string): Promise<User> {
    const minValidUntil = Date.now();
    const query: FindOneOptions<AccessToken> = {
      where: { token, validUntil: MoreThan(minValidUntil) },
      cache: 30 * 1000, // Cache access tokens for 30 seconds for subsequent requests.
    };
    const tokenResult = await this.accessTokenRepo.findOne(query);

    if (!tokenResult) {
      throw new InvalidTokenError();
    }
    return tokenResult.user;
  }

  /**
   * Creates an access token for the given user and the given alidity period.
   */
  public async createAccessToken(
    user: User,
    validFor: number = Authentication.ONE_MONTH_IN_MS,
  ): Promise<AccessToken> {
    const token: string = await Security.randomToken();
    const validUntil: number = Date.now() + validFor;
    const instance = this.accessTokenRepo.create({ token, user, validUntil });
    return this.accessTokenRepo.save(instance);
  }

  /**
   * For a valid email password pair returns the user, otherwise null.
   */
  public async authenticateUserCredentials(
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
}
