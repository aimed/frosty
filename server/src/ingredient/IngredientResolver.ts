import emojiSearch = require('@jukben/emoji-search');

import { FieldResolver, Resolver, Root } from 'type-graphql';

import { Ingredient } from './Ingredient';
import { Service } from 'typedi';
import { replaceEmoji } from './replaceEmoji';

@Service()
@Resolver(Ingredient)
export class IngredientResolver {
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
}
