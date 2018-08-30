import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { Ingredient } from '../ingredient/Ingredient';
import { ShoppingList } from './ShoppingList';
import { UNITS } from '../fridge/Units';

@Entity()
@ObjectType()
export class ShoppingListItem {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @ManyToOne(() => ShoppingList, shoppingList => shoppingList.items)
  public shoppingList!: Promise<ShoppingList>;

  @Field(() => Ingredient)
  @ManyToOne(() => Ingredient, ingredient => ingredient.fridgeIngredients)
  public item!: Promise<Ingredient>;

  @Field()
  @Column({ enum: UNITS })
  public unit!: string;

  @Field()
  @Column()
  public amount!: number;
}
