import { DeepPartial, Repository } from 'typeorm';

import { EmailPasswordPair } from './Authentication';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Security } from './Security';
import { Service } from 'typedi';
import { User } from '../user/User';

@Service()
export class Registration {
  @InjectRepository(User)
  private readonly userRepo!: Repository<User>;

  /**
   * Creates a user instance and hashes the password. Returns null if an user with the given email
   * already exists.
   * @param user The user properties.
   */
  public async createUser(user: DeepPartial<User> & EmailPasswordPair): Promise<User | null> {
    const userExists = await this.userRepo.findOne({ email: user.email });
    if (userExists) {
      return null;
    }
    const plaintextPassword = user.password;
    const hashedPassword = await User.hashPassword(plaintextPassword);
    const instance = this.userRepo.create({ ...user, password: hashedPassword });
    return this.userRepo.save(instance);
  }

  /**
   * Deletes the users account given a correct password.
   * @param user User to delete.
   * @param plaintextPassword The users password.
   */
  public async deleteUser(user: User, plaintextPassword: string): Promise<boolean> {
    const isPasswordCorrect = await User.isPasswordCorrect(plaintextPassword, user.password);
    if (!isPasswordCorrect) {
      return false;
    }
    await this.userRepo.delete(user.id, {});
    return true;
  }
}
