import './FridgeIngredient.scss';

import * as React from 'react';

import gql from 'graphql-tag';
import { FridgeIngredientFragment } from './__generated__/FridgeIngredientFragment';

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
    const name = this.props.data.ingredient.name;
    const icon = this.props.data.ingredient.icon;
    // See: https://github.com/twitter/twemoji
    const style: React.CSSProperties = {
      height: '1em',
      margin: '0 .05em 0 .1em',
      verticalAlign: '-0.1em',
      width: '1em',
    }
    return (
      <div className="FridgeIngredient">
        {/* {emoji(this.props.data.ingredient.name)} */}
        {name}
        {icon && <span><img src={icon} alt={name} style={style} /></span>}
      </div>
    );
  }
}
