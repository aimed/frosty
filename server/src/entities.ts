import { AccessToken } from './auth/AccessToken';
import { Fridge } from './fridge/Fridge';
import { FridgeIngredient } from './fridge/FridgeIngredient';
import { Ingredient } from './ingredient/Ingredient';
import { PasswordResetToken } from './auth/PasswordResetToken';
import { Role } from './user/Role';
import { ShoppingList } from './shoppinglist/ShoppingList';
import { ShoppingListItem } from './shoppinglist/ShoppingListItem';
import { User } from './user/User';

/**
 * All entities registered with TypeORM.
 * Simplifies creating connections in test and production.
 */
export function getEntities() {
  return [
    User,
    Role,
    AccessToken,
    PasswordResetToken,
    Fridge,
    FridgeIngredient,
    Ingredient,
    ShoppingList,
    ShoppingListItem,
  ];
}
