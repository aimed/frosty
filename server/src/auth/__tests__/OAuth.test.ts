import 'reflect-metadata';

import * as path from 'path';

import { Connection, Repository, createConnection, useContainer } from 'typeorm';
import { Mailer, MailerMessage } from '../../mail/Mailers';

import { AccessToken } from '../AccessToken';
import { Container } from 'typedi';
import { Crypto } from '../Crypto';
import { OAuth } from '../OAuth';
import { ResetPasswordToken } from '../ResetPasswordToken';
import { User } from '../../user/User';
import { getEntities } from '../../entities';

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
        entities: getEntities(),
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
    const token = await oauth
      .createUserCredentialsAccessToken({ email, password });
    expect(token).toBeTruthy();
    expect(token!.token).toBeTruthy();
    expect(token!.user.id).toBeTruthy();
    expect(token!.user.id).toEqual(user.id);

    const tokenInDatabase = await accessTokenRepo
      .findOne({ token: token!.token });

    expect(tokenInDatabase).toBeTruthy();
    expect(tokenInDatabase!.user).toBeTruthy();
    expect(tokenInDatabase!.user.id).toBeTruthy();

    const userForToken = await oauth.getUser(token!.token);
    expect(userForToken).toBeTruthy();

  });

  it('create and accept a password reset token', async () => {
    const email = 'email+OAuthCreateAcceptPasswordResetToken@example.com';
    const password = 'my_super_secure_password';
    const newPassword = 'my_super_secure_password_new';
    const user = await userRepo.save(userRepo.create({ email, password }));
    const resetToken = await oauth.createUserResetPasswordToken(email);
    expect(resetToken!.validUntil).toBeGreaterThan(Date.now());

    const tokenRepo = connection.getRepository(ResetPasswordToken);
    const decryptedToken = Crypto.decryptAes265(resetToken!.token);
    const existsInDatabase = await tokenRepo.findOne({ token: decryptedToken });
    expect(existsInDatabase).toBeTruthy();
    expect(existsInDatabase!.user).toBeTruthy();

    const resetResult = await oauth.userResetPassword(resetToken!.token, newPassword);
    expect(resetResult).toBeTruthy();

    const existInDatabaseAfter = await tokenRepo.findOne({ token: decryptedToken });
    expect(existInDatabaseAfter).toBeFalsy();

    const passwordIsCorrect = await oauth
    .createUserCredentialsAccessToken({ email, password: newPassword });
    expect(passwordIsCorrect).toBeTruthy();
  });

});

class TestMailer implements Mailer {
  public messagesSent: number = 0;
  public async send(message: MailerMessage) {
    this.messagesSent = this.messagesSent + 1;
  }
}
