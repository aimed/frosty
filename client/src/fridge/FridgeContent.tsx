import * as React from 'react';

import { Query, QueryResult } from 'react-apollo';

import gql from 'graphql-tag';
import { Redirect } from 'react-router';
import { FridgeContentViewer } from './__generated__/FridgeContentViewer';

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
      <div className="FridgeContent">
      {
        ingredients.edges.map((edge) => {
          return <div className="FridgeContent__Item" key={edge.cursor}>{edge.node.ingredient.name}</div>;
        })
      }
      </div>
    );
  }
}

const query = gql`query FridgeContentViewer {
  viewer {
    id
    fridge {
      ingredients {
        edges {
          cursor
          node {
            ingredient {
              id
              name
            }
          }
        }
      }
    }
  }
}`;

export function FridgeContentWithData() {
  return (
    <Query query={query}>
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