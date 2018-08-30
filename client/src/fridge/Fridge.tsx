import './Fridge.scss';

import * as React from 'react';

import posed, { PoseGroup } from 'react-pose';
import { FridgeContentViewer_viewer, FridgeContentViewer_viewer_fridge } from './__generated__/FridgeContentViewer';

import gql from 'graphql-tag';
import { LoaderContainer } from '../loader/Loader';
import { FridgeIngredientFragment_ingredient } from './__generated__/FridgeIngredientFragment';
import { IngredientsAddVariables } from './__generated__/IngredientsAdd';
import { FridgeEmpty } from './FridgeEmpty';
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
export interface FridgeProps {
  addIngredient: AddIngredientHandler;
  loading?: boolean;
  viewer?: FridgeContentViewer_viewer | null;
  fridge?: FridgeContentViewer_viewer_fridge | null;
}

const IngredientWrapper = posed.div({
  enter: { scale: 1 },
  exit: { scale: 0 },
});

export function Fridge(props: FridgeProps) {
  const { addIngredient, loading, fridge } = props;
  return (
    <div className="Fridge">
      <FridgeIngredientInputWithData addIngredient={addIngredient} />
      <div className="FridgeIngredients">
        {loading && <LoaderContainer />}
        {fridge && fridge.ingredients.edges.length === 0 && <FridgeEmpty addIngredient={props.addIngredient} />}
        {fridge && fridge.ingredients.edges.length > 0 &&
          <PoseGroup animateOnMount>
            {fridge.ingredients.edges.map((edge) => {
              return (
                <IngredientWrapper key={edge.cursor}>
                  <FridgeIngredient
                    key={edge.cursor}
                    data={edge.node}
                    addIngredient={props.addIngredient}
                  />
                </IngredientWrapper>
              );
            })}
          </PoseGroup>
        }
      </div>
    </div>
  );
}
