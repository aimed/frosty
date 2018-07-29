import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { User } from './User';

@Entity()
@ObjectType()
export class Role {
  @PrimaryColumn()
  @Field()
  public readonly name!: string;

  @ManyToMany(type => User, user => user.roles)
  public readonly users!: Promise<User[]>;
}

/**
 * Predefined roles.
 */
export const ROLES = {
  /**
   * This will disable actual checks, but still allow to resolve the user if it exists.
   */
  guest: 'guest',
  admin: 'admin',
};
