import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { ShoppingListItem } from './ShoppingListItem';
import { ShoppingListItemsConnection } from './ShoppingListItemsConnection';

/**
 * @NOTE: Having a separate shopping list that is not a property of the user allows us to have a
 *        separate resolver.
 */
@Entity()
@ObjectType()
export class ShoppingList {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field(() => ShoppingListItemsConnection)
  @OneToMany(() => ShoppingListItem, shoppingListItem => shoppingListItem.shoppingList)
  public items!: Promise<ShoppingListItem[]>;
}
