import { ArgsType, Field, ID, ObjectType } from 'type-graphql';
import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { FridgeIngredient } from './FridgeIngredient';
import { User } from '../user/User';

@ArgsType()
export class ConnectionArgs {
  @Field({ nullable: true })
  public readonly first: number = 10;

  // TODO: Should be a cursor.
  @Field({ nullable: true })
  public readonly after: number = 0;
}

@ObjectType()
export class FridgeIngredientsConnectionEdge {
  @Field()
  public cursor!: string;

  @Field(type => FridgeIngredient)
  public node!: FridgeIngredient;
}

@ObjectType()
export class FridgeIngredientsConnection {
  @Field(type => [FridgeIngredientsConnectionEdge])
  public edges!: FridgeIngredientsConnectionEdge[];
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
