import { Connection, Edge } from '../graphql/connections';
import { Field, ObjectType } from 'type-graphql';

import { Ingredient } from './Ingredient';

@ObjectType()
export class IngredientsConnectionEdge extends Edge<Ingredient> {
  @Field(() => Ingredient)
  public node!: Ingredient;
}

@ObjectType()
export class IngredientsConnection extends Connection<Ingredient> {
  @Field(() => [IngredientsConnectionEdge])
  public edges!: IngredientsConnectionEdge[];
}

export function createIngredientsConnectionEdge(ingredient: Ingredient): IngredientsConnectionEdge {
  const edge = new IngredientsConnectionEdge();
  edge.node = ingredient;
  edge.cursor = [IngredientsConnectionEdge.name, ingredient.id].join('_');
  return edge;
}
