import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { FridgeIngredient } from '../fridge/FridgeIngredient';

@Entity()
@ObjectType()
export class Ingredient {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field()
  @Index()
  @Column({ unique: true })
  public readonly name!: string;

  @Field()
  @Column()
  public readonly unit!: string;

  // Intentionally not readable to prevent snooping into other fridges.
  @OneToMany(type => FridgeIngredient, fridgeIngredient => fridgeIngredient.ingredient)
  public readonly fridgeIngredients!: FridgeIngredient;
}
