import { Connection, Repository } from 'typeorm';

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
    await connection.close();
  });

  it('creates a new user and authenticates it\'s email/password pair', async () => {
    const registration = Container.get(Registration);
    const email = 'email+OAuthCreateNewUser@example.com';
    const password = 'my_super_secure_password';

    const created = await registration.createUser({
      email,
      password,
    });
    expect(created).toBeTruthy();
    expect(created!.email).toEqual(email);

    const user = await userRepo.findOne({ email });
    expect(user).toBeTruthy();
    expect(user!.email).toEqual(email);
    expect(user!.password).not.toEqual(password);

    const validatedUser = await auth.authenticate({
      email,
      password,
    }) as User;
    expect(validatedUser).toBeTruthy();
    expect(validatedUser.email).toEqual(email);
  });
});
