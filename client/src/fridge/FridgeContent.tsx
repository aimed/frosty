import './FridgeContent.scss';

import * as React from 'react';

import { Query, QueryResult } from 'react-apollo';
import { FridgeContentViewer, FridgeContentViewer_viewer, FridgeContentViewer_viewer_fridge } from './__generated__/FridgeContentViewer';
import { IngredientsAdd, IngredientsAddVariables } from './__generated__/IngredientsAdd';

import gql from 'graphql-tag';
import { WithApolloClientProps } from '../decorators/WithApolloClient';
import { LoaderContainer } from '../loader/Loader';
import { FridgeIngredientFragment_ingredient } from './__generated__/FridgeIngredientFragment';
import { FridgeContentEmpty } from './FridgeContentEmpty';
import { FridgeIngredient } from './FridgeIngredient';
import { FridgeIngredientInputWithData } from './FridgeIngredientInput';

export const IngredientsAddMutation = gql`
mutation IngredientsAdd($name: String!, $amount: Float!, $unit: String!) {
  addIngredient(name: $name, unit: $unit, amount: $amount) {
    user {
      id
    }
    fridgeIngredientsConnectionEdge {
      cursor
      node {
        ...FridgeIngredientFragment
      }
    }
  }
}
${FridgeIngredient.fragments.fridgeIngredient}
`;

export const FridgeContentViewerQuery = gql`
query FridgeContentViewer {
  viewer {
    id
    fridge {
      ingredients(first: 20) {
        edges {
          cursor
          node {
            ...FridgeIngredientFragment
          }
        }
      }
    }
  }
}
${FridgeIngredient.fragments.fridgeIngredient}
`;

/**
 * Adds or removes an ingredient to/from the fridge.
 */
export type AddIngredientHandler = (variables: IngredientsAddVariables, optimisticData?: Partial<FridgeIngredientFragment_ingredient>) => Promise<any>;

export interface FridgeContentState { }
export interface FridgeContentProps {
  addIngredient: AddIngredientHandler;
  loading?: boolean;
  viewer?: FridgeContentViewer_viewer | null;
  fridge?: FridgeContentViewer_viewer_fridge | null;
}

export function FridgeContent(props: FridgeContentProps) {
  const { addIngredient, loading, fridge } = props;
  return (
    <div className="FridgeContent">
      <FridgeIngredientInputWithData addIngredient={addIngredient} />
      <div className="FridgeIngredients">
        {loading && <LoaderContainer />}
        {fridge && fridge.ingredients.edges.length === 0 && <FridgeContentEmpty addIngredient={props.addIngredient} />}
        {fridge && fridge.ingredients.edges.length > 0 && fridge.ingredients.edges.map((edge) => {
          return (
            <FridgeIngredient
              key={edge.cursor}
              data={edge.node}
              addIngredient={props.addIngredient}
            />
          );
        })}
      </div>
    </div>
  );
}

export class FridgeContentWithData extends React.PureComponent<WithApolloClientProps, {}> {
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
        } else /* if (edge.node.amount !== 0) */ {
          existingEdge.node.amount = edge.node.amount;
        }/* else {
          data.viewer.fridge.ingredients.edges.splice(data.viewer.fridge.ingredients.edges.indexOf(existingEdge), 1);
        }*/
        proxy.writeQuery({ data, query: FridgeContentViewerQuery });
      },
      variables,
    });
  }

  public render() {
    return (
      <Query query={FridgeContentViewerQuery}>
        {(result: QueryResult<FridgeContentViewer>) => {
          const { loading, data } = result;
          const viewer = data && data.viewer;
          const fridge = viewer && viewer.fridge;
          return <FridgeContent addIngredient={this.addIngredient} loading={loading} viewer={viewer} fridge={fridge} />
        }}
      </Query>
    );
  }
}