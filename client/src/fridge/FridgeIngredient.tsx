import './FridgeIngredient.scss';

import * as React from 'react';

import gql from 'graphql-tag';
import { FaTrashAlt } from 'react-icons/fa';
import { FridgeIngredientFragment } from './__generated__/FridgeIngredientFragment';
import { AddIngredientHandler } from './FridgeContent';
import { Ingredient } from './Ingredient';

export interface FridgeIngredientState {}
export interface FridgeIngredientProps {
  data: FridgeIngredientFragment;
  addIngredient: AddIngredientHandler;
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

  public addIngredient = async (amount: number) => {
    const { name, unit } = this.props.data.ingredient;
    await this.props.addIngredient(name, unit, amount);
  }

  public removeFromFridge = async () => {
    this.addIngredient(-this.props.data.amount);
  }

  public render() {
    const { amount, ingredient } = this.props.data;
    const { name, icon, unit } = ingredient;
    return (
      <div className="FridgeIngredient">
        <Ingredient name={name} icon={icon} />
        <span style={{ fontSize: '0.5em' }}>{`(${amount} ${unit})`}</span>
        <span onClick={this.removeFromFridge} style={{cursor: 'pointer'}}><FaTrashAlt /></span>
      </div>
    );
  }
}
