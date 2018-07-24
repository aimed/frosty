import 'reflect-metadata';

import { Collection, Db, MongoClient } from 'mongodb';
import { Mailer, MailerMessage } from '../../mail/Mailers';
import { OAuth, UserAccessToken } from '../OAuth';

import { AccessToken } from '../AccessToken';
import { Container } from 'typedi';
import { User } from '../../user/User';

describe(`${OAuth.name} `, () => {
  let connection: any;
  let db: any;
  let userCollection: Collection<User>;
  let accessTokenCollection: Collection<AccessToken>;
  let oauth: OAuth;

  beforeAll(async () => {
    Container.set(Mailer, new TestMailer());

    connection = await MongoClient.connect((global as any).__MONGO_URI__);
    db = await connection.db((global as any).__MONGO_DB_NAME__);
    Container.set(Db, db);
    userCollection = db.collection(User.name);
    accessTokenCollection = db.collection(AccessToken.name);
    oauth = Container.get(OAuth);

    process.env.PASSWORDS_PEPPER = 'my_global_pepper';
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('creates a new user and authenticates it\'s email/password pair', async () => {
    const email = 'email+OAuthCreateNewUser@example.com';
    const password = 'my_super_secure_password';

    await oauth.createUser({
      email,
      password,
    });

    const user = await userCollection.findOne({ email }) as User;
    expect(user).toBeTruthy();
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const validatedUser = await oauth.authenticate({
      email,
      password,
    }) as User;
    expect(validatedUser).toBeTruthy();
    expect(validatedUser.email).toEqual(email);
  });

  it('does not authenticate a user with an incorrect email or incorrect password ', async () => {
    const email = 'email+OAuthUserAuthenticate@example.com';
    const password = 'my_super_secure_password';
    await oauth.createUser({ email, password });

    const wrongEmail = await oauth.authenticate({
      password,
      email: email + '_wrong',
    });
    expect(wrongEmail).toEqual(null);

    const wrongPassword = await oauth.authenticate({
      email,
      password: password + '_wrong',
    });
    expect(wrongPassword).toEqual(null);
  });

  it('creates an access token for a valid email password pair', async () => {
    const email = 'email+OAuthCreateAccessToken@example.com';
    const password = 'my_super_secure_password';
    const user = await oauth.createUser({ email, password });
    const userAndToken = await oauth
      .createUserCredentialsAccessToken({ email, password }) as UserAccessToken;
    expect(userAndToken).toBeTruthy();
    expect(userAndToken.token).toBeTruthy();
    expect(userAndToken.token.userId).toEqual(user._id);

    const tokenInDatabase = await accessTokenCollection
      .findOne({ token: userAndToken.token.token });
    expect(tokenInDatabase).toBeTruthy();

    const userForToken = await oauth.getUser(userAndToken.token.token) as User;
    expect(userForToken).toBeTruthy();
    expect(userForToken._id).toEqual(user._id);
  });

});

class TestMailer implements Mailer {
  public messagesSent: number = 0;
  public async send(message: MailerMessage) {
    this.messagesSent = this.messagesSent + 1;
  }
}
