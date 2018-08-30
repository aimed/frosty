import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { FridgeIngredient } from '../fridge/FridgeIngredient';
import { ShoppingListItem } from '../shoppinglist/ShoppingListItem';

@Entity()
@ObjectType()
export class Ingredient {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field()
  @Column()
  @Index()
  public name!: string;

  // Intentionally not readable to prevent snooping into other fridges.
  @OneToMany(
    () => FridgeIngredient,
    fridgeIngredient => fridgeIngredient.ingredient,
  )
  public readonly fridgeIngredients!: Promise<FridgeIngredient>;

  // Intentionally not readable to prevent snooping into other shopping lists.
  @OneToMany(
    () => ShoppingListItem,
    shoppingListItem => shoppingListItem.item,
  )
  public readonly shoppingListItems!: Promise<ShoppingListItem>;

  @Field({ nullable: true })
  public readonly icon?: string;
}
