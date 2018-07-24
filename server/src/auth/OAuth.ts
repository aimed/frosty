import { Collection, FilterQuery } from 'mongodb';

import { AccessToken } from './AccessToken';
import { Crypto } from './Crypto';
import { MongoCollection } from '../di-decorators/MongoCollection';
import { Omit } from '../../node_modules/graphql-yoga/dist/types';
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
    @MongoCollection(type => AccessToken)
    private readonly accessTokenCollection: Collection<AccessToken>,

    @MongoCollection(type => User)
    private readonly userCollection: Collection<User>,
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
  ): Promise<UserAccessToken | null> {
    const user = await this.authenticate(emailPasswordPair);

    if (user === null) {
      return null;
    }

    const token = await this.createAccessToken(user);
    return { user, token };
  }

  /**
   * If the token is valid returns the user, otherwise returns null.
   * @param token The bearer token.
   */
  public async getUser(token: string | null | undefined): Promise<User | null> {
    if (!token) {
      return null;
    }

    const minValidUntil = Date.now();
    const query: FilterQuery<AccessToken> = { token, validUntil: { $gte: minValidUntil } };
    const tokenResult = await this.accessTokenCollection.findOne(query);

    if (tokenResult === null) {
      return null;
    }

    return this.userCollection.findOne({ _id: tokenResult.userId });
  }

  private async createAccessToken(
    user: User,
    validFor: number = OAuth.ONE_MONTH_IN_MS,
  ): Promise<AccessToken> {
    await this.ensureIndicesOnAccessToken();
    const token: string = await Crypto.randomToken();
    const userId: string = user._id;
    const validUntil: number = Date.now() + validFor;
    const result = await this.accessTokenCollection.insertOne({ token, userId, validUntil });
    return result.ops[0];
  }

  private async ensureIndicesOnAccessToken() {
    // In tests this might cause problems with mocked mongo instances
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const exists = await this.accessTokenCollection.indexExists('token');
    if (!exists.valueOf()) {
      await this.accessTokenCollection.createIndex('token', { unique: true });
    }
  }
  /**
   * For a valid email password pair returns the user, otherwise null.
   */
  public async authenticate(
    emailPasswordPair: EmailPasswordPair,
  ): Promise<User | null> {
    const { email, password } = emailPasswordPair;
    const user = await this.findUserByEmail(email);

    if (user === null) {
      return null;
    }

    const isPasswordCorrect = await Crypto.isPasswordCorrect(password, user.password);
    if (isPasswordCorrect) {
      return user;
    }

    return null;
  }

  private async ensureIndicesOnUser() {
    // In tests this might cause problems with mocked mongo instances
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const exists = await this.userCollection.indexExists('email');
    if (!exists.valueOf()) {
      await this.userCollection.createIndex('email', { unique: true });
    }
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return await this.userCollection.findOne({ email });
  }

  public async createUser(user: Omit<Omit<User, '_id'>, 'id'>): Promise<User> {
    await this.ensureIndicesOnUser();
    const plaintextPassword = user.password;
    const hashedPassword = await Crypto.hashPassword(plaintextPassword);
    const result = await this.userCollection.insertOne({ ...user, password: hashedPassword });
    return result.ops[0];
  }

  // TODO: TEST
  /**
   * Updates the users password with the hashed value and returns the a new instance with the
   * updated values or returns null if no such user existed.
   * @param user The user to update.
   * @param plaintextPassword The new plain text password.
   */
  public async userUpdatePassword(user: User, plaintextPassword: string): Promise<User | null> {
    const hashedPassword = await Crypto.hashPassword(plaintextPassword);
    await this.userCollection.updateOne(
      { _id: user._id },
      { password: hashedPassword },
    );
    const updatedUser = await this.userCollection.findOne({ _id: user._id });
    return updatedUser;
  }

  // TODO: TEST
  /**
   * Deleted the given user. Returns true if success.
   * @param user The user to delete.
   */
  public async userDelete(user: User): Promise<boolean> {
    const result = await this.userCollection.deleteOne({ _id: user._id });
    return !!result.deletedCount;
  }
}
