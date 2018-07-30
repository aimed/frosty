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

import { Fridge } from './Fridge';
import { FridgeIngredient } from './FridgeIngredient';
import { Ingredient } from '../ingredient/Ingredient';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { UNITS } from '../ingredient/Units';
import { User } from '../user/User';

@ArgsType()
export class AddIngredientArgs {
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
export class AddIngredientResponse {
  @Field()
  public readonly ingredient: FridgeIngredient;

  @Field()
  public readonly user: User;

  public constructor(ingredient: FridgeIngredient, user: User) {
    this.ingredient = ingredient;
    this.user = user;
  }
}

@Service()
@Resolver()
export class FridgeResolver {
  @InjectRepository(Ingredient)
  private readonly ingredientRepo!: Repository<Ingredient>;

  @InjectRepository(FridgeIngredient)
  private readonly fridgeIngredientRepo!: Repository<FridgeIngredient>;

  @Authorized()
  @Mutation(type => AddIngredientResponse)
  public async addIngredient(
    @Ctx('user') user: User,
    @Args() args: AddIngredientArgs,
  ): Promise<AddIngredientResponse> {
    const { name, unit, amount } = args;

    let ingredient = await this.ingredientRepo.findOne({ name, unit });
    if (!ingredient) {
      ingredient = this.ingredientRepo.create({ name, unit });
      ingredient = await this.ingredientRepo.save(ingredient);
    }

    const fridge = await user.fridge;
    const fridgeIngredient = this.fridgeIngredientRepo.create({ amount });
    fridgeIngredient.fridge = Promise.resolve(fridge);
    fridgeIngredient.ingredient = Promise.resolve(ingredient);
    await this.fridgeIngredientRepo.save(fridgeIngredient);

    return new AddIngredientResponse(fridgeIngredient, user);
  }
}
