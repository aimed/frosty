import './FridgeContent.scss';

import * as React from 'react';

import { Query, QueryResult } from 'react-apollo';

import gql from 'graphql-tag';
import { Redirect } from 'react-router';
import { FridgeContentViewer } from './__generated__/FridgeContentViewer';
import { FridgeIngredient } from './FridgeIngredient';
import { FridgeIngredientInputWithData } from './FridgeIngredientInput';

export interface FridgeContentState {}
export interface FridgeContentProps {
  data: FridgeContentViewer;
}

export class FridgeContent extends React.PureComponent<FridgeContentProps, FridgeContentState> {
  public render() {
    const viewer = this.props.data.viewer;
    
    if (!viewer) {
      return null;
    }

    const ingredients = viewer.fridge.ingredients;
    return (
      <>
        <div className="FridgeContent">
          <FridgeIngredientInputWithData />
          <div className="FridgeIngredients">
          {
            ingredients.edges.map((edge) => {
              return <FridgeIngredient key={edge.cursor} data={edge.node} />;
            })
          }
          </div>
        </div>
      </>
    );
  }
}

export const FridgeContentViewerQuery = gql`
query FridgeContentViewer {
  viewer {
    id
    fridge {
      ingredients {
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

export function FridgeContentWithData() {
  return (
    <Query query={FridgeContentViewerQuery}>
      {(result: QueryResult<FridgeContentViewer>) => {
        if (result.loading) {
          return null;
        }

        if (!result.data) {
          return null;
        }

        if (!result.data.viewer) {
          return <Redirect to="/signin" />;
        }

        return <FridgeContent data={result.data} />;
      }}
      </Query>
  );
}