import {
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';
import { IsIn, IsNumber, MinLength } from 'class-validator';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { ShoppingListItem } from './ShoppingListItem';
import { ShoppingListItemsConnectionEdge } from './ShoppingListItemsConnection';
import { UNITS } from '../fridge/Units';
import { User } from '../user/User';

@ArgsType()
class AddItemArgs {
  @Field()
  @MinLength(1)
  public readonly name!: string;

  @Field()
  @IsIn(UNITS)
  public readonly unit!: string;

  @Field()
  @IsNumber()
  public readonly amount!: number;
}

@ObjectType()
class AddItemResponse {
  @Field()
  public shoppingListItemsConnectionEdge!: ShoppingListItemsConnectionEdge;
}

@Service()
@Resolver()
export class ShoppingListResolver {
  @InjectRepository(() => ShoppingListItem)
  private readonly shoppingListItemRepo!: Repository<ShoppingListItem>;

  @Mutation(() => AddItemResponse)
  @Authorized()
  public async addItem(
    @Args() addItem: AddItemArgs,
    @Ctx('user') user: User,
  ): Promise<AddItemResponse> {
    // let ShoppingListItem;
    throw new Error('Not implemented');
  }
}
