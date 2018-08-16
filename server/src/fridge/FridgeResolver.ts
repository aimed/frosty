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
import { ConnectionArgs, PageInfo } from '../graphql/connections';
import {
  FridgeIngredientsConnection,
  FridgeIngredientsConnectionEdge,
  createFridgeIngredientsConnectionEdge,
} from './FridgeIngredientsConnection';
import { IsIn, IsNumber, MinLength } from 'class-validator';

import {
  Fridge,
} from './Fridge';
import { FridgeIngredient } from './FridgeIngredient';
import { Ingredient } from '../ingredient/Ingredient';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { UNITS } from './Units';
import { User } from '../user/User';

@ArgsType()
class AddIngredientArgs {
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
class AddIngredientResponse {
  @Field()
  public readonly ingredient: FridgeIngredient;

  @Field()
  public readonly user: User;

  @Field(() => FridgeIngredientsConnectionEdge)
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

  public async findOrCreateIngredient(name: string) {
    let ingredient = await this.ingredientRepo.findOne({ where: { name } });
    if (!ingredient) {
      ingredient = this.ingredientRepo.create({ name });
      ingredient = await this.ingredientRepo.save(ingredient);
    }
    return ingredient;
  }

  public async findOrCreateFridgeIngredient(
    ingredient: Ingredient | Promise<Ingredient>,
    unit: string,
    fridge: Fridge | Promise<Fridge>,
  ) {
    const [ingredientInstance, fridgeInstance] = await Promise.all([ingredient, fridge]);

    let fridgeIngredient = await this.fridgeIngredientRepo
    .createQueryBuilder('fridgeIngredient')
    .where('fridgeIngredient.fridgeId = :fridgeId', { fridgeId: fridgeInstance.id })
    .andWhere(
      'fridgeIngredient.ingredientId = :ingredientId',
      { ingredientId: ingredientInstance.id })
    .andWhere('fridgeIngredient.unit = :unit', { unit })
    .getOne();

    if (!fridgeIngredient) {
      fridgeIngredient = this.fridgeIngredientRepo.create({ unit, amount: 0 });
      fridgeIngredient.fridge = Promise.resolve(fridgeInstance);
      fridgeIngredient.ingredient = Promise.resolve(ingredientInstance);
      await this.fridgeIngredientRepo.save(fridgeIngredient);
    }
    return fridgeIngredient;
  }

  @Authorized()
  @Mutation(
    () => AddIngredientResponse,
    { description: `Adds the ingredient to the fridge. If it already exists, this will add to the` +
                   ` existing amount.`,
    })
  public async addIngredient(
    @Ctx('user') user: User,
    @Args() args: AddIngredientArgs,
  ): Promise<AddIngredientResponse> {
    const { name, unit, amount } = args;
    const [ingredient, fridge] = await Promise.all([
      this.findOrCreateIngredient(name),
      user.fridge,
    ]);
    const fridgeIngredient = await this.findOrCreateFridgeIngredient(
      ingredient,
      unit,
      fridge,
    );
    fridgeIngredient.amount = fridgeIngredient.amount + amount;
    await this.fridgeIngredientRepo.save(fridgeIngredient);
    const edge = createFridgeIngredientsConnectionEdge(fridgeIngredient);
    return new AddIngredientResponse(fridgeIngredient, user, edge);
  }

  @FieldResolver()
  public async ingredients(
    @Root() fridge: Fridge,
    @Args() args: ConnectionArgs,
  ) {
    const [ingredients, count] =
    await this.fridgeIngredientRepo.manager
    .createQueryBuilder(FridgeIngredient, 'content')
    .where('content.fridgeId = :fridgeId', { fridgeId: fridge.id })
    .andWhere('content.amount <> 0')
    .take(args.first)
    .skip(args.after)
    .leftJoinAndMapOne('content.ingredient', 'content.ingredient', 'ingredient')
    .getManyAndCount();

    const connection = new FridgeIngredientsConnection();
    connection.edges = ingredients.map(createFridgeIngredientsConnectionEdge);
    connection.pageInfo = new PageInfo(args.first + args.after < count);
    return connection;
  }
}
