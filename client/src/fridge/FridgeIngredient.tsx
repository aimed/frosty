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
        amount
        ingredient {
          id
          name
          unit
          icon
        }
      }
    `
  };

  public render() {
    const { amount, ingredient } = this.props.data;
    const { name, icon, unit } = ingredient;
    return (
      <div className="FridgeIngredient">
        <Ingredient name={name} icon={icon} />
        <span style={{ fontSize: '0.5em' }}>{`(${amount} ${unit})`}</span>
      </div>
    );
  }
}
