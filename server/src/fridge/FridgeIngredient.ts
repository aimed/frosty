import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { Fridge } from './Fridge';
import { Ingredient } from '../ingredient/Ingredient';

@Entity()
@ObjectType()
export class FridgeIngredient {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  // @Field(type => Fridge)
  @ManyToOne(type => Fridge, fridge => fridge.ingredients)
  public readonly fridge!: Fridge;

  @Field(type => Ingredient)
  @ManyToOne(type => Ingredient, ingredient => ingredient.fridgeIngredients, { eager: true })
  public readonly ingredient!: Ingredient;

  @Field()
  @Column()
  public readonly amount!: number;
}
