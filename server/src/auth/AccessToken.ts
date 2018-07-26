import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { User } from '../user/User';

@Entity()
@ObjectType()
export class AccessToken {
  // TODO: Optionally store tokens encrypted to avoid leaking. Requires a secure mechanism for key.
  @PrimaryColumn({ unique: true })
  @Field()
  public readonly token!: string;

  @ManyToOne(type => User, user => user.accessTokens, { eager: true })
  @Field(type => User)
  public readonly user!: User;

  @Column()
  @Field({ description: 'Date until the token is valid in UTC ms.' })
  public readonly validUntil!: number;
}
