

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FridgeContentViewer
// ====================================================

export interface FridgeContentViewer_viewer_fridge_ingredients_edges_node_ingredient {
  id: string;
  name: string;
  icon: string | null;
}

export interface FridgeContentViewer_viewer_fridge_ingredients_edges_node {
  ingredient: FridgeContentViewer_viewer_fridge_ingredients_edges_node_ingredient;
}

export interface FridgeContentViewer_viewer_fridge_ingredients_edges {
  cursor: string;
  node: FridgeContentViewer_viewer_fridge_ingredients_edges_node;
}

export interface FridgeContentViewer_viewer_fridge_ingredients {
  edges: FridgeContentViewer_viewer_fridge_ingredients_edges[];
}

export interface FridgeContentViewer_viewer_fridge {
  ingredients: FridgeContentViewer_viewer_fridge_ingredients;
}

export interface FridgeContentViewer_viewer {
  id: string;
  fridge: FridgeContentViewer_viewer_fridge;
}

export interface FridgeContentViewer {
  /**
   * The currently authenticated user.
   */
  viewer: FridgeContentViewer_viewer | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================