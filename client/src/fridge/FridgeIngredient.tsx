import './FridgeIngredient.scss';

import * as React from 'react';

import gql from 'graphql-tag';
import { FridgeIngredientFragment } from './__generated__/FridgeIngredientFragment';
import { Ingredient } from './Ingredient';

export interface FridgeIngredientState {}
export interface FridgeIngredientProps {
  data: FridgeIngredientFragment
}

export class FridgeIngredient extends React.PureComponent<FridgeIngredientProps, FridgeIngredientState> {
  public static readonly fragments = {
    fridgeIngredient: gql`
      fragment FridgeIngredientFragment on FridgeIngredient {
        ingredient {
          id
          name
          icon
        }
      }
    `
  };

  public render() {
    const {name, icon} = this.props.data.ingredient;
    return (
      <div className="FridgeIngredient">
        <Ingredient name={name} icon={icon} />
      </div>
    );
  }
}
