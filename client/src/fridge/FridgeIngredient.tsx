import './FridgeIngredient.scss';

import * as React from 'react';

import { FaMinusCircle, FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import { Ingredient, IngredientFragment } from './Ingredient';

import { classnames } from '@hydrokit/utils';
import gql from 'graphql-tag';
import { FridgeIngredientFragment } from './__generated__/FridgeIngredientFragment';
import { AddIngredientHandler } from './Fridge';

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
        unit
        ingredient {
          id
          name
          icon
          ...IngredientFragment
        }
      }
      ${IngredientFragment}
    `
  };

  public addIngredient = async (amount: number, unit: string) => {
    const { name } = this.props.data.ingredient;
    await this.props.addIngredient({ name, unit, amount });
  }

  public reduceAmount: React.MouseEventHandler = (e) => {
    this.addIngredient(-1, '');
  }

  public removeFromFridge: React.MouseEventHandler = (e) => {
    this.addIngredient(-this.props.data.amount, '');
  }

  public increaseAmount: React.MouseEventHandler = (e) => {
    this.addIngredient(1, '');
  }

  public render() {
    const { amount, unit, ingredient } = this.props.data;
    const { name, icon } = ingredient;
    const hasBeenDeleted = amount === 0;
    const containerClassName = classnames(
      'FridgeIngredient',
      hasBeenDeleted && 'FridgeIngredient--deleted'
    );
    return (
      <div className={containerClassName}>
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
