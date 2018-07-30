import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { FridgeIngredient } from '../fridge/FridgeIngredient';
import { UNITS } from './Units';

@Entity()
@ObjectType()
@Index(['name', 'unit'])
export class Ingredient {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field()
  @Column()
  public name!: string;

  @Field()
  @Column({ enum: UNITS })
  public unit!: string;

  // Intentionally not readable to prevent snooping into other fridges.
  @OneToMany(
    type => FridgeIngredient,
    fridgeIngredient => fridgeIngredient.ingredient,
  )
  public readonly fridgeIngredients!: Promise<FridgeIngredient>;
}
