import { Connection, Repository } from 'typeorm';
import { Mailer, MailerMessage } from '../../mail/Mailers';

import { AccessToken } from '../AccessToken';
import { Container } from 'typedi';
import { OAuth } from '../OAuth';
import { PasswordReset } from '../PasswordReset';
import { Role } from '../../user/Role';
import { User } from '../../user/User';
import { createTestConnection } from '../../__tests__/createTestConnection';

describe(`${OAuth.name} `, () => {
  let connection: Connection;
  let userRepo: Repository<User>;
  let accessTokenRepo: Repository<AccessToken>;
  let oauth: OAuth;

  beforeAll(async () => {
    try {
      Container.set(Mailer, new TestMailer());
      connection = await createTestConnection();
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
    const roleRepo = connection.getRepository(Role);
    const role = await roleRepo.save(roleRepo.create({ name: 'TEST' }));
    const roles = Promise.resolve([role]);
    const user = await oauth.createUser({ email, password });
    user.roles = roles;
    await userRepo.save(user);
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

    const userRoles = await userForToken!.roles;
    expect(userRoles).toBeTruthy();
    expect(userRoles!.length).toBeTruthy();
  });
});

class TestMailer implements Mailer {
  public messagesSent: number = 0;
  public async send() {
    this.messagesSent = this.messagesSent + 1;
  }
}
