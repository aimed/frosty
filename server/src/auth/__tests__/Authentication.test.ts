import { Connection, Repository } from 'typeorm';

import { AccessToken } from '../AccessToken';
import { Authentication } from '../Authentication';
import { Container } from 'typedi';
import { Mailer } from '../../mail/Mailers';
import { Registration } from '../Registration';
import { Role } from '../../user/Role';
import { User } from '../../user/User';
import { createTestConnection } from '../../__tests__/createTestConnection';

describe(`${Authentication.name} `, () => {
  let connection: Connection;
  let userRepo: Repository<User>;
  let accessTokenRepo: Repository<AccessToken>;
  let oauth: Authentication;

  beforeAll(async () => {
    try {
      Container.set(Mailer, new TestMailer());
      connection = await createTestConnection();
      userRepo = connection.getRepository(User);
      accessTokenRepo = connection.getRepository(AccessToken);
      oauth = Container.get(Authentication);
      process.env.PASSWORDS_PEPPER = 'my_global_pepper';
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('does not authenticate a user with an incorrect email or incorrect password ', async () => {
    const registration = Container.get(Registration);
    const email = 'email+OAuthUserAuthenticate@example.com';
    const password = 'my_super_secure_password';
    await registration.createUser({ email, password });

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
    const registration = Container.get(Registration);
    const email = 'email+OAuthCreateAccessTokenForEmailPassword@example.com';
    const password = 'my_super_secure_password';
    const roleRepo = connection.getRepository(Role);
    const role = await roleRepo.save(roleRepo.create({ name: 'TEST' }));
    const roles = Promise.resolve([role]);
    const user = await registration.createUser({ email, password });
    user!.roles = roles;
    await userRepo.save(user!);
    const token = await oauth
      .createUserCredentialsAccessToken({ email, password });
    expect(token).toBeTruthy();
    expect(token!.token).toBeTruthy();
    expect(token!.user.id).toBeTruthy();
    expect(token!.user.id).toEqual(user!.id);

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
