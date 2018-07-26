import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Security } from './Security';
import { User } from '../user/User';

@Entity()
export class PasswordResetToken {
  @PrimaryColumn({ unique: true })
  public readonly token!: string;

  @Column()
  public readonly validUntil!: number;

  @ManyToOne(type => User, user => user.resetPasswordTokens, { eager: true })
  public readonly user!: User;

  /**
   * Encrypts and encodes the given token.
   * @param tokenString The token as a string.
   */
  public static encrypt(tokenString: string) {
    const encrypted = Security.encryptAes265(tokenString);
    const encoded = encodeURIComponent(encrypted);
    return encoded;
  }

  /**
   * Decrypts and decodes the given token.
   * @param encryptedTokenString The encrypted and encoded token.
   */
  public static decrypt(encryptedTokenString: string) {
    const decoded = decodeURIComponent(encryptedTokenString);
    const decrypted = Security.decryptAes265(decoded);
    return decrypted;
  }

}
