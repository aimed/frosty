import { Field, ObjectType } from 'type-graphql';

import { Ingredient } from './Ingredient';
import { PageInfo } from '../graphql/connections';

@ObjectType()
export class IngredientsConnectionEdge {
  @Field()
  public cursor!: string;
  @Field(type => Ingredient)
  public node!: Ingredient;
}

@ObjectType()
export class IngredientsConnection {
  @Field(type => [IngredientsConnectionEdge])
  public edges!: IngredientsConnectionEdge[];
  @Field()
  public pageInfo!: PageInfo;
}

export function createIngredientsConnectionEdge(ingredient: Ingredient): IngredientsConnectionEdge {
  const edge = new IngredientsConnectionEdge();
  edge.node = ingredient;
  edge.cursor = [IngredientsConnectionEdge.name, ingredient.id].join('');
  return edge;
}
