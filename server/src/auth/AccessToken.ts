import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { User } from '../user/User';

@Entity()
@ObjectType()
export class AccessToken {
//  @ObjectIdColumn()
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @ManyToOne(type => User, user => user.accessTokens, { eager: true })
  @Field(type => User)
  public readonly user!: User;

  @Column({ unique: true })
  @Field()
  public readonly token!: string;

  @Column()
  @Field({ description: 'Date until the token is valid in UTC ms.' })
  public readonly validUntil!: number;
}
