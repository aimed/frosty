import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { Fridge } from './Fridge';
import { Ingredient } from '../ingredient/Ingredient';
import { UNITS } from './Units';

@Entity()
@Index(['fridge', 'ingredient'])
@ObjectType()
export class FridgeIngredient {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @ManyToOne(type => Fridge, fridge => fridge.ingredients, { cascade: true })
  public fridge!: Promise<Fridge>;

  @Field(type => Ingredient)
  @ManyToOne(type => Ingredient, ingredient => ingredient.fridgeIngredients)
  public ingredient!: Promise<Ingredient>;

  @Field()
  @Column()
  public amount!: number;

  @Field()
  @Column({ enum: UNITS })
  public unit!: string;

}
