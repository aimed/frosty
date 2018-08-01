import { ArgsType, Field, ID, ObjectType } from 'type-graphql';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { FridgeIngredient } from './FridgeIngredient';

@ObjectType()
export class FridgeIngredientsConnectionEdge {
  @Field()
  public cursor!: string;

  @Field(type => FridgeIngredient)
  public node!: FridgeIngredient;
}

@ObjectType()
export class FridgeIngredientsConnection {
  @Field(type => [FridgeIngredientsConnectionEdge])
  public edges!: FridgeIngredientsConnectionEdge[];
  // TODO: Add PageInfo.
}

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
