import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { FridgeIngredient } from './FridgeIngredient';
import {
  FridgeIngredientsConnection,
} from './FridgeIngredientsConnection';

/**
 * @NOTE: Having a separate fridge that is not part of the user allows us to have a separate
 *        resolver.
 */
@Entity()
@ObjectType()
export class Fridge {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field(() => FridgeIngredientsConnection)
  @OneToMany(() => FridgeIngredient, fridgeIngredients => fridgeIngredients.fridge)
  public ingredients!: Promise<FridgeIngredient[]>;
}
