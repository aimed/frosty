import emojiSearch = require('@jukben/emoji-search');

import {
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { ConnectionArgs, PageInfo } from '../graphql/connections';

import { Ingredient } from './Ingredient';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { replaceEmoji } from './replaceEmoji';

@ObjectType()
export class IngredientsConnectionEdge {
  @Field()
  public cursor!: string;

  @Field(type => Ingredient)
  public node!: Ingredient;
}

@ObjectType()
export class IngredientsConnection {
  @Field(type => [IngredientsConnectionEdge])
  public edges!: IngredientsConnectionEdge[];

  @Field()
  public pageInfo!: PageInfo;
}

@ArgsType()
export class AllIngredientsConnectionArgs extends ConnectionArgs {
  @Field({ nullable: true })
  public search?: string;
}

@Service()
@Resolver(Ingredient)
export class IngredientResolver {
  @InjectRepository(Ingredient)
  private readonly ingredientsRepo!: Repository<Ingredient>;

  @FieldResolver()
  public icon(@Root() ingredient: Ingredient): string | null {
    const emojis = emojiSearch(ingredient.name);
    const emoji = emojis.length ? emojis[0] : null;

    if (!emoji) {
      return null;
    }

    const char = emoji.char;
    const link = replaceEmoji(char);
    const size = '72x72';
    const ext = '.png';
    return `//twemoji.maxcdn.com/2/${size}/${link}${ext}`;
  }

  @Query(of => IngredientsConnection)
  public async allIngredients(
    @Args() args: AllIngredientsConnectionArgs,
  ): Promise<IngredientsConnection> {
    const { search, first, after } = args;
    let query = this.ingredientsRepo
    .createQueryBuilder('ingredient')
    .take(first)
    .skip(after);

    if (search) {
      query = query.where('ingredient.name like :search', { search: `%${search}%` });
    }

    const [ingredients, count] = await query.getManyAndCount();
    const edges = ingredients.map((ingredient) => {
      const edge = new IngredientsConnectionEdge();
      edge.node = ingredient;
      edge.cursor = [IngredientsConnectionEdge.name, ingredient.id].join('');
      return edge;
    });

    const pageInfo = new PageInfo();
    pageInfo.hasNextPage = count > (after + first);

    const connection = new IngredientsConnection();
    connection.edges = edges;
    connection.pageInfo = pageInfo;

    return connection;
  }
}
