import './FridgeIngredient.scss';

import * as React from 'react';

import { FaMinusCircle, FaPlusCircle, FaTrashAlt } from 'react-icons/fa';

import gql from 'graphql-tag';
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

  public reduceAmount = () => {
    this.addIngredient(-1);
  }

  public removeFromFridge = () => {
    this.addIngredient(-this.props.data.amount);
  }

  public increaseAmount = () => {
    this.addIngredient(1);
  }

  public render() {
    const { amount, ingredient } = this.props.data;
    const { name, icon, unit } = ingredient;
    return (
      <div className="FridgeIngredient">
        <Ingredient name={name} icon={icon} />
        <span className="FridgeIngredient__Amount">{`${amount} ${unit}`}</span>
        <span className="FridgeIngredient__FlexSpace" />
        <span className="FridgeIngredient__Action FridgeIngredient__Add" onClick={this.increaseAmount}><FaPlusCircle /></span>
        <span className="FridgeIngredient__Action FridgeIngredient__Reduce" onClick={this.reduceAmount}><FaMinusCircle /></span>
        <span className="FridgeIngredient__Action FridgeIngredient__Remove" onClick={this.removeFromFridge}><FaTrashAlt /></span>
      </div>
    );
  }
}
