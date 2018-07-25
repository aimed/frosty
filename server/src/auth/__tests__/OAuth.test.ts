import 'reflect-metadata';

import * as path from 'path';

import { Connection, Repository, createConnection, useContainer } from 'typeorm';
import { Mailer, MailerMessage } from '../../mail/Mailers';

import { AccessToken } from '../AccessToken';
import { Container } from 'typedi';
import { OAuth } from '../OAuth';
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
        type: 'sqlite',
        database: path.join(__dirname, 'test-oauth.sqlite3'),
        entities: [User, AccessToken],
        synchronize: true,
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
    await connection.dropDatabase();
    await connection.close();
  });

  it('repo should create', async () => {
    const repo = connection.getRepository(User);
    const email = 'LOL@example.com';
    const password = 'test';
    const user = await repo.save({ email, password });
    const all = await repo.find();
    expect(all.length).toBeGreaterThan(0);

    const found = await repo.findOne({ email });
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

    const user = await userRepo.findOne({ email });
    expect(user).toBeTruthy();
    expect(user!.email).toEqual(email);
    expect(user!.password).not.toEqual(password);

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

  it('can create an access token', async () => {
    const email = 'email+OAuthCreateAccessToken@example.com';
    const password = 'my_super_secure_password';
    const user = userRepo.create({ email, password });
    await userRepo.save(user);
    const token = await oauth.createAccessToken(user);
    expect(token).toBeTruthy();
    expect(token.user).toBeTruthy();

    const tokenInDatabase = await accessTokenRepo.findOne({ token: token.token });
    expect(tokenInDatabase).toBeTruthy();
    expect(tokenInDatabase!.user).toBeTruthy();
  });

  it('creates an access token for a valid email password pair', async () => {
    const email = 'email+OAuthCreateAccessTokenForEmailPassword@example.com';
    const password = 'my_super_secure_password';
    const user = await oauth.createUser({ email, password });
    const userAndToken = await oauth
      .createUserCredentialsAccessToken({ email, password });
    expect(userAndToken).toBeTruthy();
    expect(userAndToken!.token).toBeTruthy();
    expect(userAndToken!.user.id).toBeTruthy();
    expect(userAndToken!.user.id).toEqual(user.id);
    expect(userAndToken!.token.user).toBeTruthy();
    expect(userAndToken!.token.user.id).toBeTruthy();
    expect(userAndToken!.token.user.id).toEqual(user.id);

    const tokenInDatabase = await accessTokenRepo
      .findOne({ token: userAndToken!.token.token });

    expect(tokenInDatabase).toBeTruthy();
    expect(tokenInDatabase!.user).toBeTruthy();
    expect(tokenInDatabase!.user.id).toBeTruthy();

    const userForToken = await oauth.getUser(userAndToken!.token.token);
    expect(userForToken).toBeTruthy();

  });

});

class TestMailer implements Mailer {
  public messagesSent: number = 0;
  public async send(message: MailerMessage) {
    this.messagesSent = this.messagesSent + 1;
  }
}
