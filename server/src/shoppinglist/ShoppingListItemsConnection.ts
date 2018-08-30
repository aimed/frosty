import { Connection, Edge } from '../graphql/connections';
import { Field, ObjectType } from 'type-graphql';

import { ShoppingListItem } from './ShoppingListItem';

@ObjectType()
export class ShoppingListItemsConnectionEdge extends Edge<ShoppingListItem> {
  @Field(() => ShoppingListItem)
  public node!: ShoppingListItem;
}

@ObjectType()
export class ShoppingListItemsConnection extends Connection<ShoppingListItem> {
  @Field(() => ShoppingListItemsConnectionEdge)
  public edges!: Edge<ShoppingListItem>[];
}

export function createShoppingListItemsEdge(
  node: ShoppingListItem,
): ShoppingListItemsConnectionEdge {
  const edge = new ShoppingListItemsConnectionEdge();
  edge.node = node;
  edge.cursor = [ShoppingListItemsConnectionEdge.name, node.id].join('_');
  return edge;
}
