import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { Config } from '../config/Config';

/**
 * A helper class to implement cryptography aspects of the user authentication process.
 * This is based on the dropbox blogpost linked below.
 * See https://blogs.dropbox.com/tech/2016/09/how-dropbox-securely-stores-your-passwords/
 */
export class Security {
  /**
   * A global pepper used to encrypt passwords after they have been hashed.
   */
  private static get PASSWORDS_PEPPER(): string {
    return Config.get('PASSWORDS_PEPPER');
  }

  /**
   * Number of rounds used to create salts for bcrypt.
   */
  private static get SALT_ROUNDS(): number {
    return parseInt(Config.get('SALT_ROUNDS', '10'), 10);
  }

  /**
   * Hashes the given string using sha512.
   * @param password The string to hash.
   */
  public static hashSha512(password: string): string {
    const hash = crypto.createHash('sha512');
    hash.update(password);
    return hash.digest('hex');
  }

  /**
   * Hash the given string using bcrypt.
   * @param passwordHash The string to hash.
   */
  public static async hashBcrypt(passwordHash: string): Promise<string> {
    const hashed = bcrypt.hash(passwordHash, Security.SALT_ROUNDS);
    return hashed;
  }

  /**
   * Encrypts the given text symetrically.
   * See https://github.com/JamesMGreene/node-aes256/blob/master/index.js
   * @param plaintext The text to encrypt.
   * @param key The key to use.
   */
  public static encryptAes265(
    plaintext: string,
    key: string = Security.PASSWORDS_PEPPER,
  ): string {
    const sha256 = crypto.createHash('sha256');
    sha256.update(key);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(Security.AES_CIPHER_ALGORITHM, sha256.digest(), iv);

    const ciphertext = cipher.update(new Buffer(plaintext));
    const encrypted = Buffer.concat([iv, ciphertext, cipher.final()]).toString('base64');
    return encrypted;
  }

  /**
   * Decrypts the given text symetrically.
   * See https://github.com/JamesMGreene/node-aes256/blob/master/index.js
   * @param encrypted The text to encrypt.
   * @param key The key to use.
   */
  public static decryptAes265(
    encrypted: string,
    key: string = Security.PASSWORDS_PEPPER,
  ): string {
    const sha256 = crypto.createHash('sha256');
    sha256.update(key);

    const input = new Buffer(encrypted, 'base64');

    if (input.length < 17) {
      throw new Error('Invalid encrypted string');
    }

    const iv = input.slice(0, 16);
    const decipher = crypto.createDecipheriv(
      Security.AES_CIPHER_ALGORITHM,
      sha256.digest(),
      iv,
    );

    const ciphertext = input.slice(16);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString();
    return plaintext;
  }

  /**
   * Hashes and encrypts the given password based on the aforementioned dropbox blogpost.
   * @param plaintext The password to hash.
   */
  public static async hashPassword(plaintext: string): Promise<string> {
    const sha512 = Security.hashSha512(plaintext);
    const bcrypted = await Security.hashBcrypt(sha512);
    const encrypted = Security.encryptAes265(bcrypted);
    return encrypted;
  }

  /**
   * Compares the plaintext to the ecrypted and hashed password and returns true if the passwords
   * match.
   * @param plaintext The plain text password to compare to the encrypted string.
   * @param encrypted An encrypted and hashed passwort.
   */
  public static async isPasswordCorrect(plaintext: string, encrypted: string): Promise<boolean> {
    const hashed = Security.hashSha512(plaintext);
    const decrypted = Security.decryptAes265(encrypted);
    const isCorrect = await bcrypt.compare(hashed, decrypted);
    return isCorrect;
  }

  /**
   * Cipher algorithm to use for aes encryption.
   */
  private static readonly AES_CIPHER_ALGORITHM = 'aes-256-ctr';

  /**
   * Creates a secure random token based on crypto.randomBytes.
   * See https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
   */
  public static randomToken = (numberOfBytes: number = 48): Promise<string> => new Promise<string>(
    (resolve, reject) =>
      crypto.randomBytes(
        numberOfBytes,
        (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            const token = buffer.toString('hex');
            resolve(token);
          }
        }),
  )
}
