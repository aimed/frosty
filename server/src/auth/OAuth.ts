import { DeepPartial, MoreThan, Repository } from 'typeorm';

import { AccessToken } from './AccessToken';
import { Crypto } from './Crypto';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Request } from 'express';
import { Service } from 'typedi';
import { User } from '../user/User';

export interface UserAccessToken {
  token: AccessToken;
  user: User;
}

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
    const query = { where: { token, validUntil: MoreThan(minValidUntil) } };
    const tokenResult = await this.accessTokenRepo.findOne(query);

    if (!tokenResult) {
      return null;
    }
    return tokenResult.user;
  }

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
    const user = await this.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await Crypto.isPasswordCorrect(password, user.password);
    if (isPasswordCorrect) {
      return user;
    }

    return null;
  }

  public async findUserByEmail(email: string): Promise<User | null | undefined> {
    return this.userRepo.findOne({ email });
  }

  public async createUser(user: DeepPartial<User> & EmailPasswordPair): Promise<User> {
    const plaintextPassword = user.password;
    const hashedPassword = await Crypto.hashPassword(plaintextPassword);
    const instance = this.userRepo.create({ ...user, password: hashedPassword });
    return this.userRepo.save(instance);
  }

  // TODO: TEST
  /**
   * Updates the users password with the hashed value and returns the a new instance with the
   * updated values or returns null if no such user existed.
   * @param user The user to update.
   * @param plaintextPassword The new plain text password.
   */
  // public async userUpdatePassword(user: User, plaintextPassword: string): Promise<User | null> {
  //   const hashedPassword = await Crypto.hashPassword(plaintextPassword);
  //   await this.userCollection.updateOne(
  //     { _id: user.id },
  //     { password: hashedPassword },
  //   );
  //   const updatedUser = await this.userCollection.findOne({ _id: user.id });
  //   return updatedUser;
  // }

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
