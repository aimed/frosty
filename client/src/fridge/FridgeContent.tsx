import './FridgeContent.scss';

import * as React from 'react';

import { Query, QueryResult } from 'react-apollo';
import { IngredientsAdd, IngredientsAddVariables } from './__generated__/IngredientsAdd';

import gql from 'graphql-tag';
import { Redirect } from 'react-router';
import { FetchResult } from '../../node_modules/apollo-link';
import { WithApolloClientProps } from '../decorators/WithApolloClient';
import { LoaderContainer } from '../loader/Loader';
import { FridgeContentViewer } from './__generated__/FridgeContentViewer';
import { FridgeIngredient } from './FridgeIngredient';
import { FridgeIngredientInputWithData } from './FridgeIngredientInput';

export const IngredientsAddMutation = gql`
mutation IngredientsAdd($name: String!, $amount: Float!) {
  addIngredient(name: $name, unit: "g", amount: $amount) {
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
export type AddIngredientHandler = (name: string, unit: string, amount: number) => Promise<FetchResult<IngredientsAdd, Record<string, any>>>;

export interface FridgeContentState { }
export interface FridgeContentProps {
  addIngredient: AddIngredientHandler;
}

export function FridgeContent(props: FridgeContentProps) {
  return (
    <div className="FridgeContent">
      <FridgeIngredientInputWithData addIngredient={props.addIngredient} />
      <div className="FridgeIngredients">
        <Query query={FridgeContentViewerQuery}>
          {(result: QueryResult<FridgeContentViewer>) => {
            if (result.loading) {
              return (
                <LoaderContainer />
              );
            }

            if (!result.data) {
              return null;
            }

            if (!result.data.viewer) {
              return <Redirect to="/signin" />;
            }

            return (
              result.data.viewer.fridge.ingredients.edges.map((edge) => {
                return (
                  <FridgeIngredient
                    key={edge.cursor}
                    data={edge.node}
                    addIngredient={props.addIngredient}
                  />
                );
              })
            );
          }}
        </Query>
      </div>
    </div>
  );
}

export class FridgeContentWithData extends React.PureComponent<WithApolloClientProps, {}> {
  public addIngredient: AddIngredientHandler = async (name, unit, amount) => {
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
      variables: { name, amount },
    });
  }

  public render() {
    return (
      <FridgeContent addIngredient={this.addIngredient} />
    );
  }
}