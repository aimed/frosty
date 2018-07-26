import { Inject, Service } from 'typedi';
import { MoreThan, Repository } from 'typeorm';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { PasswordResetToken } from './PasswordResetToken';
import { Security } from './Security';
import { User } from '../user/User';

export interface ExpiringUserToken {
  token: string;
  validUntil: number;
  user: User;
}

@Service()
export class PasswordReset {
  @InjectRepository(User)
  private readonly userRepo!: Repository<User>;

  @InjectRepository(PasswordResetToken)
  private readonly resetPasswordTokenRepo!: Repository<PasswordResetToken>;

  /**
   * Creates a password reset token that can be used to reset a users password.
   * Returns the token if operation was successfull (user exists and token has been created),
   * otherwise returns null.
   *
   * IMPORTANT: SECURITY: In order to prevent unauthorized password resets, the token is stored
   * encrypted using the global pepper.
   * Furthermore the validity duration should be limited to a reasonable timeframe.
   * See:
   * https://postmarkapp.com/guides/password-reset-email-best-practices#secure-password-reset-emails
   * @param email The users email.
   * @param validFor The validity of the token.
   */
  public async getToken(
    email: string,
    validFor: number =  1000 * 60 * 10 /* 10 minutes */,
  ): Promise<ExpiringUserToken | null> {
    const user = await this.userRepo.findOne({ email });
    if (!user) {
      return null;
    }

    const token = await Security.randomToken();
    const validUntil = Date.now() + validFor;
    const instance = this.resetPasswordTokenRepo.create({
      user,
      validUntil,
      token,
    });
    await this.resetPasswordTokenRepo.save(instance);
    const encryptedToken = PasswordResetToken.encrypt(token);
    return {
      user,
      validUntil,
      token: encryptedToken,
    };
  }

  /**
   * Resets a users password using the given token.
   * @param encryptedToken The encrypted reset token.
   * @param plaintextPassword The new user password in plaintext.
   */
  public async resetPassword(
    encryptedToken: string,
    plaintextPassword: string,
  ): Promise<User | null> {
    // TODO: Delete all old tokens
    const token = PasswordResetToken.decrypt(encryptedToken);
    const validUntil = Date.now();
    const query = { where: { token, validUntil: MoreThan(validUntil) } };
    const tokenInstance = await this.resetPasswordTokenRepo.findOne(query);
    if (!tokenInstance || !tokenInstance.user) {
      return null;
    }
    const password = await Security.hashPassword(plaintextPassword);
    await this.userRepo.update({ id: tokenInstance.user.id }, { password });
    await this.resetPasswordTokenRepo.delete({ user: tokenInstance.user });
    return tokenInstance.user;
  }
}