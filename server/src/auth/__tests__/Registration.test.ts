import { Connection, Repository } from 'typeorm';

import { AccessToken } from '../AccessToken';
import { Authentication } from '../Authentication';
import { Container } from 'typedi';
import { Registration } from '../Registration';
import { User } from '../../user/User';
import { createTestConnection } from '../../__tests__/createTestConnection';

describe(Registration.name, () => {
  let connection: Connection;
  let registration: Registration;
  let auth: Authentication;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    process.env.PASSWORDS_PEPPER = 'my_global_pepper';
    connection = await createTestConnection();
    registration = Container.get(Registration);
    userRepo = connection.getRepository(User);
    auth = Container.get(Authentication);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('creates a new user and authenticates it\'s email/password pair', async () => {
    const email = 'email+OAuthCreateNewUser@example.com';
    const password = 'my_super_secure_password';

    const created = await registration.createUser({
      email,
      password,
    });
    expect(created).toBeTruthy();
    expect(created!.email).toEqual(email);
    expect(await created!.fridge).toBeTruthy();
    expect(await created!.shoppingList).toBeTruthy();

    const user = await userRepo.findOne({ email });
    expect(user).toBeTruthy();
    expect(user!.email).toEqual(email);
    expect(user!.password).not.toEqual(password);

    const validatedUser = await auth.authenticateUserCredentials({
      email,
      password,
    }) as User;
    expect(validatedUser).toBeTruthy();
    expect(validatedUser.email).toEqual(email);
  });

  it('can delete a user given a correct passowrd', async () => {
    const email = 'email+DeleUser@example.com';
    const password = 'my_super_secure_password';

    const created = await registration.createUser({
      email,
      password,
    });
    expect(created).toBeTruthy();

    const token = await auth.createAccessToken(created!);
    expect(token).toBeTruthy();

    const deleted = await registration.deleteUser(created!, password);
    expect(deleted).toBeTruthy();
    const userInDatabase = await userRepo.findOne({ email });
    expect(userInDatabase).toBeFalsy();

    const accessTokens = await connection.getRepository(AccessToken).find();
    const tokensForUser = accessTokens.filter(t => t.token === token.token);
    expect(tokensForUser.length).toBeFalsy();
  });
});
