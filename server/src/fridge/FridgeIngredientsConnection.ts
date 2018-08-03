import { Connection, Edge } from '../graphql/connections';
import { Field, ObjectType } from 'type-graphql';

import { FridgeIngredient } from './FridgeIngredient';

@ObjectType()
export class FridgeIngredientsConnectionEdge extends Edge<FridgeIngredient> {
  @Field(() => FridgeIngredient)
  public node!: FridgeIngredient;
}

@ObjectType()
export class FridgeIngredientsConnection extends Connection<FridgeIngredient> {
  @Field(() => [FridgeIngredientsConnectionEdge])
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

export function getFridgeIngredientIdFromCursor(cursor: string) {
  return cursor.split('.')[1];
}
