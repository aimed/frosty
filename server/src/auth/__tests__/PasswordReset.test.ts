import { Authentication } from '../Authentication';
import { Connection } from 'typeorm';
import { Container } from 'typedi';
import { PasswordReset } from '../PasswordReset';
import { PasswordResetToken } from '../PasswordResetToken';
import { User } from '../../user/User';
import { createTestConnection } from '../../__tests__/createTestConnection';

describe(PasswordReset.name, () => {
  let connection: Connection;

  beforeAll(async () => {
    process.env.PASSWORDS_PEPPER = 'my_global_pepper';
    connection = await createTestConnection();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('create and accept a password reset token', async () => {
    const userRepo = connection.getRepository(User);
    const passwordReset = Container.get(PasswordReset);
    const auth = Container.get(Authentication);

    const email = 'email+OAuthCreateAcceptPasswordResetToken@example.com';
    const password = 'my_super_secure_password';
    const newPassword = 'my_super_secure_password_new';
    const user = await userRepo.save(userRepo.create({ email, password }));
    const resetTokenResponse = await passwordReset.getToken(email);
    expect(resetTokenResponse!.validUntil).toBeGreaterThan(Date.now());

    const tokenRepo = connection.getRepository(PasswordResetToken);
    const decryptedToken = PasswordResetToken.decrypt(resetTokenResponse!.token);
    const existsInDatabase = await tokenRepo.findOne({ token: decryptedToken });
    expect(existsInDatabase).toBeTruthy();
    expect(existsInDatabase!.user).toBeTruthy();

    const resetResult = await passwordReset.resetPassword(resetTokenResponse!.token, newPassword);
    expect(resetResult).toBeTruthy();

    const existInDatabaseAfter = await tokenRepo.findOne({ token: decryptedToken });
    expect(existInDatabaseAfter).toBeFalsy();

    const passwordIsCorrect = await auth
    .createUserCredentialsAccessToken({ email, password: newPassword });
    expect(passwordIsCorrect).toBeTruthy();
  });

  it('does not accept an expired token', async () => {
    const userRepo = connection.getRepository(User);
    const passwordReset = Container.get(PasswordReset);

    const email = 'email+OAuthNotAcceptExpiredPasswordResetToken@example.com';
    const password = 'my_super_secure_password';
    const newPassword = 'my_super_secure_password_new';
    const user = await userRepo.save(userRepo.create({ email, password }));
    const resetToken = await passwordReset.getToken(email, -1000);
    await expect(passwordReset.resetPassword(resetToken!.token, newPassword)).rejects.toThrow();
    // const resetResult = await passwordReset.resetPassword(resetToken!.token, newPassword);
    // expect(resetResult).toBeFalsy();
  });

  it('does not accept an non existing token', async () => {
    const userRepo = connection.getRepository(User);
    const passwordReset = Container.get(PasswordReset);
    const email = 'email+OAuthNotAcceptInvalidPasswordResetToken@example.com';
    const password = 'my_super_secure_password';
    const newPassword = 'my_super_secure_password_new';
    const user = await userRepo.save(userRepo.create({ email, password }));
    await expect(passwordReset.resetPassword(
      PasswordResetToken.encrypt('DOES_NOT_EXIST'),
      newPassword)).rejects.toThrow();
  });
});
