import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  FridgeIngredientsConnection,
  FridgeIngredientsConnectionEdge,
} from './FridgeIngredientsConnection';

import { FridgeIngredient } from './FridgeIngredient';

@Entity()
@ObjectType()
export class Fridge {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field(type => FridgeIngredientsConnection)
  @OneToMany(type => FridgeIngredient, fridgeIngredients => fridgeIngredients.fridge)
  public ingredients!: Promise<FridgeIngredient[]>;
}
