import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { AccessToken } from '../auth/AccessToken';
import { ResetPasswordToken } from '../auth/ResetPasswordToken';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column({ unique: true })
  @Field()
  public email!: string;

  @Column()
  public password!: string;

  @OneToMany(type => AccessToken, token => token.user)
  public accessTokens!: AccessToken[];

  @OneToMany(type => ResetPasswordToken, token => token.user)
  public resetPasswordTokens!: ResetPasswordToken[];
}
