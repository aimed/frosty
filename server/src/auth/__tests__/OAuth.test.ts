import 'reflect-metadata';

import * as url from 'url';

import { Connection, Repository, createConnection, useContainer } from 'typeorm';
import { Mailer, MailerMessage } from '../../mail/Mailers';
import { OAuth, UserAccessToken } from '../OAuth';

import { AccessToken } from '../AccessToken';
import { Container } from 'typedi';
import { User } from '../../user/User';

describe(`${OAuth.name} `, () => {
  let connection: Connection;
  let userRepo: Repository<User>;
  let accessTokenRepo: Repository<AccessToken>;
  let oauth: OAuth;

  beforeAll(async () => {
    try {
      useContainer(Container);
      Container.set(Mailer, new TestMailer());
      connection = await createConnection({
        type: 'mongodb',
        url: (global as any).__MONGO_URI__,
        database: (global as any).__MONGO__DB_NAME__,
        entities: [User, AccessToken],
      });
      Container.set(Connection, connection);
      userRepo = connection.getRepository(User);
      accessTokenRepo = connection.getRepository(AccessToken);
      oauth = Container.get(OAuth);

      process.env.PASSWORDS_PEPPER = 'my_global_pepper';
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    await connection.close();
  });

  it('repo should create', async () => {
    const mongoUserRepo = connection.getMongoRepository(User);
    const email = 'LOL@example.com';
    const user = await mongoUserRepo.save({ email });
    const all = await mongoUserRepo.find();
    expect(all.length).toBeGreaterThan(0);

    const found = await mongoUserRepo.findOne({ email });
    expect(user).toBeTruthy();
    expect(found).toBeTruthy();
  });

  it('creates a new user and authenticates it\'s email/password pair', async () => {
    const email = 'email+OAuthCreateNewUser@example.com';
    const password = 'my_super_secure_password';

    const created = await oauth.createUser({
      email,
      password,
    });
    expect(created).toBeTruthy();
    expect(created.email).toEqual(email);

    const user = await userRepo.findOne({ email }) as User;
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
    // expect(userAndToken.token.user.id.toHexString()).toEqual(user.id.toHexString());

    const tokenInDatabase = await accessTokenRepo
      .findOne({ token: userAndToken.token.token });
    expect(tokenInDatabase).toBeTruthy();

    const userForToken = await oauth.getUser(userAndToken.token.token) as User;
    expect(userForToken).toBeTruthy();
    // expect(userForToken.id).toEqual(user.id);
    const allUsersMatchingEmail = await userRepo.find({ email });
    expect(allUsersMatchingEmail.length).toEqual(1);
  });

});

class TestMailer implements Mailer {
  public messagesSent: number = 0;
  public async send(message: MailerMessage) {
    this.messagesSent = this.messagesSent + 1;
  }
}
