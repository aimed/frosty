

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IngredientsSearch
// ====================================================

export interface IngredientsSearch_allIngredients_edges_node {
  id: string;
  name: string;
  unit: string;
  icon: string | null;
}

export interface IngredientsSearch_allIngredients_edges {
  node: IngredientsSearch_allIngredients_edges_node;
}

export interface IngredientsSearch_allIngredients {
  edges: IngredientsSearch_allIngredients_edges[];
}

export interface IngredientsSearch {
  allIngredients: IngredientsSearch_allIngredients;
}

export interface IngredientsSearchVariables {
  search?: string | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================