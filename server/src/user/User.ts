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

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
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
}
