import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { AccessToken } from '../auth/AccessToken';
import { PasswordResetToken } from '../auth/PasswordResetToken';

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
}
