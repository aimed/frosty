import {
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { ConnectionArgs, PageInfo } from '../graphql/connections';
import { IngredientsConnection, createIngredientsConnectionEdge } from './IngredientsConnection';

import { Ingredient } from './Ingredient';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { replaceEmoji } from './replaceEmoji';

import emojiSearch = require('@jukben/emoji-search');

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
    const edges = ingredients.map(createIngredientsConnectionEdge);

    const pageInfo = new PageInfo();
    pageInfo.hasNextPage = count > (after + first);

    const connection = new IngredientsConnection();
    connection.edges = edges;
    connection.pageInfo = pageInfo;

    return connection;
  }
}
