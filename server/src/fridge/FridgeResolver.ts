import {
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Resolver,
  Root,
} from 'type-graphql';
import {
  Fridge,
  FridgeIngredientsConnection,
  FridgeIngredientsConnectionEdge,
  createFridgeIngredientsConnectionEdge,
} from './Fridge';
import { IsIn, IsNumber, MinLength } from 'class-validator';

import { ConnectionArgs } from '../graphql/connections';
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

  @Field()
  public readonly fridgeIngredientsConnectionEdge: FridgeIngredientsConnectionEdge;

  public constructor(
    ingredient: FridgeIngredient,
    user: User,
    edge: FridgeIngredientsConnectionEdge,
  ) {
    this.ingredient = ingredient;
    this.user = user;
    this.fridgeIngredientsConnectionEdge = edge;
  }
}

@Service()
@Resolver(Fridge)
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
    const edge = await createFridgeIngredientsConnectionEdge(fridgeIngredient);
    return new AddIngredientResponse(fridgeIngredient, user, edge);
  }

  @FieldResolver()
  public async ingredients(
    @Root() fridge: Fridge,
    @Args() args: ConnectionArgs,
  ): Promise<FridgeIngredientsConnection> {

    const [ingredients, count] = await this.fridgeIngredientRepo.manager
    .createQueryBuilder(FridgeIngredient, 'content')
    // TODO: Doesn't work currently, need to map manually, see:
    //       https://github.com/typeorm/typeorm/issues/673
    // .addSelect('SUM(content.amount)', 'total')
    // .groupBy('content.ingredientId')
    .where('content.fridgeId = :fridgeId', { fridgeId: fridge.id })
    .take(args.first)
    .skip(args.after)
    .loadRelationIdAndMap('content.ingredientId', 'content.ingredient')
    .printSql()
    .getManyAndCount();

    const connection = new FridgeIngredientsConnection();
    connection.edges = await Promise.all(ingredients.map(createFridgeIngredientsConnectionEdge));
    return connection;
  }
}
