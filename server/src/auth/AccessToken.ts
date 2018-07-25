import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { User } from '../user/User';

@Entity()
@ObjectType()
export class AccessToken {
  @ManyToOne(type => User, user => user.accessTokens, { eager: true })
  @Field(type => User)
  public readonly user!: User;

  @PrimaryColumn({ unique: true })
  @Field()
  public readonly token!: string;

  @Column()
  @Field({ description: 'Date until the token is valid in UTC ms.' })
  public readonly validUntil!: number;
}
