import { AccessToken } from './AccessToken';
import { Collection } from 'mongodb';
import { Crypto } from './Crypto';
import { Mailer } from '../mail/Mailers';
import { MongoCollection } from '../di-decorators/MongoCollection';
import { Service } from 'typedi';
import { User } from '../user/User';

export interface EmailPasswordPair {
  email: string;
  password: string;
}

@Service()
export class Authentication {
  public constructor(
    private readonly mailer: Mailer,
    @MongoCollection(of => User)
    private readonly userCollection: Collection<User>,
  ) {}

  /**
   * Creates a new user account and notifies the user via email.
   * If an account for the given email exists, an email informing the user that he has already sign-
   * ed up will be sent.
   *
   * IMPORTANT: SECURITY: To prevent user enumeration, we never return any info on wheather an acco-
   * unt exists.
   */
  public async register(emailPasswordPair: EmailPasswordPair): Promise<void> {
    const { email, password } = emailPasswordPair;
    const userWithEmailExists = await this.userWithEmailExists(email);

    if (userWithEmailExists) {
      await this.mailer.send({
        from: Mailer.DefaultFromAddress,
        to: email,
        subject: `Your registration at frosty`,
        text: `
          Hello ${email},
          you tried to sign up for a frosty account, but we noticed that an account with your email\
          already exists.
          You can log in at https://frosty.norocketlab.net/ or reset your password if you forgot it.
        `,
      });
      return;
    }

    await this.userCreate(emailPasswordPair);
    await this.mailer.send({
      from: Mailer.DefaultFromAddress,
      to: email,
      subject: `Your registration at frosty`,
      text: `\
        Hello ${email},
        thanks for signing up with frosty!\
      `,
    });
  }

  /**
   * For a valid email password pair returns the user, otherwise null.
   */
  public async authenticate(
    emailPasswordPair: EmailPasswordPair,
  ): Promise<User | null> {
    const { email, password } = emailPasswordPair;
    const user = await this.findUserByEmail(email);

    if (user === null) {
      return null;
    }

    const isPasswordCorrect = await Crypto.isPasswordCorrect(password, user.password);
    if (isPasswordCorrect) {
      return user;
    }

    return null;
  }

  private async ensureIndicesOnUser() {
    // In tests this might cause problems with mocked mongo instances
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const exists = await this.userCollection.indexExists('email');
    if (!exists.valueOf()) {
      await this.userCollection.createIndex('email', { unique: true });
    }
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return await this.userCollection.findOne({ email });
  }

  private async userWithEmailExists(email: string): Promise<boolean> {
    return await this.findUserByEmail(email) !== null;
  }

  public async userCreate(user: Partial<User> & EmailPasswordPair): Promise<User> {
    await this.ensureIndicesOnUser();
    const plaintextPassword = user.password;
    const hashedPassword = await Crypto.hashPassword(plaintextPassword);
    const result = await this.userCollection.insertOne({ ...user, password: hashedPassword });
    return result.ops[0];
  }

  // TODO: TEST
  /**
   * Updates the users password with the hashed value and returns the a new instance with the
   * updated values or returns null if no such user existed.
   * @param user The user to update.
   * @param plaintextPassword The new plain text password.
   */
  public async userUpdatePassword(user: User, plaintextPassword: string): Promise<User | null> {
    const hashedPassword = await Crypto.hashPassword(plaintextPassword);
    await this.userCollection.updateOne(
      { _id: user._id },
      { password: hashedPassword },
    );
    const updatedUser = await this.userCollection.findOne({ _id: user._id });
    return updatedUser;
  }

  // TODO: TEST
  /**
   * Deleted the given user. Returns true if success.
   * @param user The user to delete.
   */
  public async userDelete(user: User): Promise<boolean> {
    const result = await this.userCollection.deleteOne({ _id: user._id });
    return !!result.deletedCount;
  }
}
