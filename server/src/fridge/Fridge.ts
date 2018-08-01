import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { FridgeIngredient } from './FridgeIngredient';

@ObjectType()
export class FridgeIngredientsConnectionEdge {
  @Field()
  public cursor!: string;

  @Field(type => FridgeIngredient)
  public node!: FridgeIngredient;
}

export async function createFridgeIngredientsConnectionEdge(
  fridgeIngredient: FridgeIngredient,
): Promise<FridgeIngredientsConnectionEdge> {
  const edge = new FridgeIngredientsConnectionEdge();
  edge.node = fridgeIngredient;
  edge.cursor = [FridgeIngredientsConnectionEdge.name, fridgeIngredient.id].join('.');
  return edge;
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
