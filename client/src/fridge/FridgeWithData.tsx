import * as React from 'react';

import { Query, QueryResult } from 'react-apollo';
import { IngredientsAdd, IngredientsAddVariables } from './__generated__/IngredientsAdd';
import { AddIngredientHandler, Fridge, FridgeContentViewerQuery, IngredientsAddMutation } from './Fridge';

import { WithApolloClientProps } from '../decorators/WithApolloClient';
import { FridgeContentViewer } from './__generated__/FridgeContentViewer';

export class FridgeWithData extends React.PureComponent<WithApolloClientProps, {}> {
  public addIngredient: AddIngredientHandler = async (variables) => {
    return this.props.client.mutate<IngredientsAdd, IngredientsAddVariables>({
      mutation: IngredientsAddMutation,
      update: (proxy, response) => {
        const data = proxy.readQuery<FridgeContentViewer>({ query: FridgeContentViewerQuery });
        if (!data || !data.viewer || !response.data || !response.data.addIngredient) {
          return;
        }
        const addIngredient = response.data.addIngredient;
        const edge = addIngredient.fridgeIngredientsConnectionEdge;
        const existingEdge = data.viewer.fridge.ingredients.edges.find(existing => existing.node.ingredient.id === edge.node.ingredient.id);
        if (!existingEdge) {
          data.viewer.fridge.ingredients.edges.push(edge);
        }
        else /* if (edge.node.amount !== 0) */ {
          existingEdge.node.amount = edge.node.amount;
        } /* else {
                  data.viewer.fridge.ingredients.edges.splice(data.viewer.fridge.ingredients.edges.indexOf(existingEdge), 1);
                }*/
        proxy.writeQuery({ data, query: FridgeContentViewerQuery });
      },
      variables,
    });
  };
  public render() {
    return (<Query query={FridgeContentViewerQuery}>
      {(result: QueryResult<FridgeContentViewer>) => {
        const { loading, data } = result;
        const viewer = data && data.viewer;
        const fridge = viewer && viewer.fridge;
        return <Fridge addIngredient={this.addIngredient} loading={loading} viewer={viewer} fridge={fridge} />;
      }}
    </Query>);
  }
}