import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { FridgeIngredient } from '../fridge/FridgeIngredient';

@Entity()
@ObjectType()
export class Ingredient {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field()
  @Column()
  @Index()
  public name!: string;

  // Intentionally not readable to prevent snooping into other fridges.
  @OneToMany(
    () => FridgeIngredient,
    fridgeIngredient => fridgeIngredient.ingredient,
  )
  public readonly fridgeIngredients!: Promise<FridgeIngredient>;

  @Field({ nullable: true })
  public readonly icon?: string;
}
