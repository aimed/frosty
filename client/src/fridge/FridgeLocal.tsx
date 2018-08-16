import * as React from 'react';

import { withApollo, WithApolloClient } from 'react-apollo';
import { FridgeContentViewer_viewer_fridge, FridgeContentViewer_viewer_fridge_ingredients_edges } from './__generated__/FridgeContentViewer';
import { GetIngredient, GetIngredientVariables } from './__generated__/GetIngredient';
import { AddIngredientHandler, Fridge } from './Fridge';

import gql from 'graphql-tag';
import { IngredientFragment } from './Ingredient';

const getIngredientQuery = gql`
  query GetIngredient($name: String!) {
    getIngredient(name: $name) {
      ...IngredientFragment
    }
  }
  ${IngredientFragment}
`;
export interface FridgeLocalState {
  fridge: FridgeContentViewer_viewer_fridge;
}

export interface FridgeLocalProps {
}

export class FridgeLocal extends React.Component<WithApolloClient<FridgeLocalProps>, FridgeLocalState> {
  public state: FridgeLocalState = {
    fridge: {
      ingredients: {
        edges: []
      }
    }
  }

  public get edges(): FridgeContentViewer_viewer_fridge_ingredients_edges[] {
    return this.state.fridge.ingredients.edges;
  }

  public getEdge(ingredient: string, unit: string): number {
    return this.edges.findIndex(edge => edge.node.ingredient.name === ingredient && edge.node.unit === unit);
  }

  public addIngredient: AddIngredientHandler = async ({ name, unit, amount }, optimisticIngredient) => {
    const existingEdgeIndex = this.getEdge(name, unit);
    let newEdge: FridgeContentViewer_viewer_fridge_ingredients_edges;
    let edges: FridgeContentViewer_viewer_fridge_ingredients_edges[];

    if (existingEdgeIndex >= 0) {
      const existingEdge = this.edges[existingEdgeIndex];
      newEdge = {
        cursor: existingEdge.cursor,
        node: {
          ...existingEdge.node,
          amount: existingEdge.node.amount + amount,
        }
      };
      edges = [...this.edges];
      edges.splice(existingEdgeIndex, 1, newEdge);
    } else {
      const serverResponse = await this.props.client.query<GetIngredient, GetIngredientVariables>({ variables: { name }, query: getIngredientQuery });
      const serverIngredient = serverResponse.data.getIngredient;
      const id = (optimisticIngredient && optimisticIngredient.id) || 'LocalIngredient_' + Date.now();
      const cursor = 'FridgeIngredientsEdge_' + id;
      newEdge = {
        cursor,
        node: {
          amount,
          ingredient: {
            icon: optimisticIngredient && optimisticIngredient.icon ? optimisticIngredient.icon : null,
            id,
            name,
            ...serverIngredient
          },
          unit,
        }
      };
      edges = [...this.edges, newEdge];
    }
    this.setState({ fridge: { ingredients: { edges } } });
  }

  public render() {
    return <Fridge addIngredient={this.addIngredient} fridge={this.state.fridge} />;
  }
}

export const FridgeLocalWithData = withApollo(FridgeLocal);
