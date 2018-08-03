import { Connection, Edge, PageInfo } from '../graphql/connections';
import { Field, ObjectType } from 'type-graphql';

import { FridgeIngredient } from './FridgeIngredient';

@ObjectType()
export class FridgeIngredientsConnectionEdge extends Edge<FridgeIngredient> {
  @Field(type => FridgeIngredient)
  public node!: FridgeIngredient;
}

@ObjectType()
export class FridgeIngredientsConnection extends Connection<FridgeIngredient> {
  @Field(type => [FridgeIngredientsConnectionEdge])
  public edges!: FridgeIngredientsConnectionEdge[];
}

export function createFridgeIngredientsConnectionEdge(
  fridgeIngredient: FridgeIngredient,
) {
  const edge = new FridgeIngredientsConnectionEdge();
  edge.node = fridgeIngredient;
  edge.cursor = [FridgeIngredientsConnectionEdge.name, fridgeIngredient.id].join('.');
  return edge;
}
