import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { AccessToken } from '../auth/AccessToken';
import { PasswordResetToken } from '../auth/PasswordResetToken';
import { Role } from './Role';
import { Security } from '../auth/Security';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number;

  @Column({ unique: true })
  @Index()
  @Field()
  public email!: string;

  @Column()
  public password!: string;

  @OneToMany(type => AccessToken, token => token.user)
  public accessTokens!: AccessToken[];

  @OneToMany(type => PasswordResetToken, token => token.user)
  public resetPasswordTokens!: PasswordResetToken[];

  @ManyToMany(type => Role, role => role.users)
  @JoinTable()
  @Field(type => [Role])
  public roles!: Promise<Role[]>;

  /**
   * Hashes the users password.
   * @param plaintextPassword The plain text password.
   */
  public static hashPassword(plaintextPassword: string): Promise<string> {
    return Security.hashPassword(plaintextPassword);
  }

  /**
   * Compares the plain text password to the hashed one and returns true if they're equal.
   * @param plaintextPassword The plain text password.
   * @param hashedPassword The hashed password.
   */
  public static isPasswordCorrect(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return Security.isPasswordCorrect(plaintextPassword, hashedPassword);
  }
}
