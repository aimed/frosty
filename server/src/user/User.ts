import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { AccessToken } from '../auth/AccessToken';
import { Fridge } from '../fridge/Fridge';
import { PasswordResetToken } from '../auth/PasswordResetToken';
import { Role } from './Role';
import { Security } from '../auth/Security';
import { ShoppingList } from '../shoppinglist/ShoppingList';

@Entity()
@ObjectType()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column({ unique: true })
  @Index()
  public email!: string;

  @Column()
  public password!: string;

  @OneToMany(type => AccessToken, token => token.user)
  public accessTokens!: AccessToken[];

  @OneToMany(type => PasswordResetToken, token => token.user)
  public resetPasswordTokens!: PasswordResetToken[];

  @Field(type => [Role])
  @ManyToMany(type => Role, role => role.users)
  @JoinTable()
  public roles!: Promise<Role[]>;

  @Field(type => Fridge)
  @OneToOne(type => Fridge, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  public fridge!: Promise<Fridge>;

  @Field(type => ShoppingList)
  @OneToOne(type => ShoppingList, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  public shoppingList!: Promise<ShoppingList>;

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
