import { Authentication, EmailPasswordPair } from './Authentication';

import { AccessToken } from './AccessToken';
import { Collection } from 'mongodb';
import { Crypto } from './Crypto';
import { MongoCollection } from '../di-decorators/MongoCollection';
import { Request } from 'express';
import { Service } from 'typedi';
import { User } from '../user/User';

export interface UserAccessToken {
  token: AccessToken;
  user: User;
}

@Service()
export class OAuth {
  private static readonly ONE_MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

  public constructor(
    private readonly authententication: Authentication,
    @MongoCollection(type => AccessToken)
    private readonly accessTokenCollection: Collection<AccessToken>,
    @MongoCollection(type => User)
    private readonly userCollection: Collection<User>,
  ) {
  }

  /**
   * Returns the token on the request header.
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
  public async userCredentialsAccessToken(
    emailPasswordPair: EmailPasswordPair,
  ): Promise<UserAccessToken | null> {
    const user = await this.authententication.authenticate(emailPasswordPair);

    if (user === null) {
      return null;
    }

    const token = await this.createAccessTokenForUser(user);
    return { user, token };
  }

  /**
   * If the token is valid returns the user, otherwise returns null.
   * @param token The bearer token.
   */
  public async userForAccessToken(token: string | null | undefined): Promise<User | null> {
    if (!token) {
      return null;
    }

    const minValidUntil = Date.now();
    const tokenResult = await this.accessTokenCollection.findOne(
      {
        token,
        validUntil: { $gte: minValidUntil },
      },
    );

    if (tokenResult === null) {
      return null;
    }

    return this.userCollection.findOne({ _id: tokenResult.userId });
  }

  private async createAccessTokenForUser(
    user: User,
    validFor: number = OAuth.ONE_MONTH_IN_MS,
  ): Promise<AccessToken> {
    // await this.ensureIndicesOnAccessToken();
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
}
