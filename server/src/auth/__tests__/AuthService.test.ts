import 'reflect-metadata';

import { Collection, Db, MongoClient } from 'mongodb';
import { Mailer, MailerMessage } from '../../mail/Mailers';

import { AccessToken } from '../AccessToken';
import { Authentication } from '../Authentication';
import { Container } from 'typedi';
import { User } from '../../user/User';

describe(`${Authentication.name} `, () => {
  let connection: any;
  let db: any;
  let userCollection: Collection<User>;
  let accessTokenCollection: Collection<AccessToken>;
  let authService: Authentication;

  beforeAll(async () => {
    Container.set(Mailer, new TestMailer());

    connection = await MongoClient.connect((global as any).__MONGO_URI__);
    db = await connection.db((global as any).__MONGO_DB_NAME__);
    Container.set(Db, db);
    userCollection = db.collection(User.name);
    accessTokenCollection = db.collection(AccessToken.name);
    authService = Container.get(Authentication);

    process.env.PASSWORDS_PEPPER = 'my_global_pepper';
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('creates a new user and authenticates it\'s email/password pair', async () => {
    const email = 'email+AuthServiceCreateNewUser@example.com';
    const password = 'my_super_secure_password';

    await authService.userCreate({
      email,
      password,
    });

    const user = await userCollection.findOne({ email }) as User;
    expect(user).toBeTruthy();
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const validatedUser = await authService.authenticate({
      email,
      password,
    }) as User;
    expect(validatedUser).toBeTruthy();
    expect(validatedUser.email).toEqual(email);
  });

  it('does not authenticate a user with an incorrect email or incorrect password ', async () => {
    const email = 'email+AuthServiceUserAuthenticate@example.com';
    const password = 'my_super_secure_password';
    await authService.userCreate({ email, password });

    const wrongEmail = await authService.authenticate({
      password,
      email: email + '_wrong',
    });
    expect(wrongEmail).toEqual(null);

    const wrongPassword = await authService.authenticate({
      email,
      password: password + '_wrong',
    });
    expect(wrongPassword).toEqual(null);

  });

});

class TestMailer implements Mailer {
  public messagesSent: number = 0;
  public async send(message: MailerMessage) {
    this.messagesSent = this.messagesSent + 1;
  }
}
