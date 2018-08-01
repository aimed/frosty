

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
  addIngredient: IngredientsAdd_addIngredient;
}

export interface IngredientsAddVariables {
  name: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================