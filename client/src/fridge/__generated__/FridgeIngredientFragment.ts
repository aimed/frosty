/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FridgeIngredientFragment
// ====================================================

export interface FridgeIngredientFragment_ingredient {
  id: string;
  name: string;
  icon: string | null;
}

export interface FridgeIngredientFragment {
  amount: number;
  unit: string;
  ingredient: FridgeIngredientFragment_ingredient;
}
