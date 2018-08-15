/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetIngredient
// ====================================================

export interface GetIngredient_getIngredient {
  name: string;
  icon: string | null;
  unit: string;
}

export interface GetIngredient {
  getIngredient: GetIngredient_getIngredient | null;
}

export interface GetIngredientVariables {
  name: string;
  unit: string;
}
