/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: IngredientsAdd
// ====================================================

export interface IngredientsAdd_addIngredient_user {
  id: string;
}

export interface IngredientsAdd_addIngredient_fridgeIngredientsConnectionEdge_node_ingredient {
  id: string;
  name: string;
  icon: string | null;
}

export interface IngredientsAdd_addIngredient_fridgeIngredientsConnectionEdge_node {
  amount: number;
  unit: string;
  ingredient: IngredientsAdd_addIngredient_fridgeIngredientsConnectionEdge_node_ingredient;
}

export interface IngredientsAdd_addIngredient_fridgeIngredientsConnectionEdge {
  cursor: string;
  node: IngredientsAdd_addIngredient_fridgeIngredientsConnectionEdge_node;
}

export interface IngredientsAdd_addIngredient {
  user: IngredientsAdd_addIngredient_user;
  fridgeIngredientsConnectionEdge: IngredientsAdd_addIngredient_fridgeIngredientsConnectionEdge;
}

export interface IngredientsAdd {
  /**
   * Adds the ingredient to the fridge. If it already exists, this will add to the existing amount.
   */
  addIngredient: IngredientsAdd_addIngredient;
}

export interface IngredientsAddVariables {
  name: string;
  amount: number;
  unit: string;
}
