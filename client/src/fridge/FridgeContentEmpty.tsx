import * as React from 'react';

import { AddIngredientHandler } from './FridgeContent';
import { Ingredient } from './Ingredient';

export interface FridgeContentEmptyProps {
  addIngredient: AddIngredientHandler;
}

export const FridgeContentEmpty: React.StatelessComponent<FridgeContentEmptyProps> = props => {
  const add = () => props.addIngredient({ name: 'broccoli', unit: 'piece', amount: 1 }, { icon: '//twemoji.maxcdn.com/2/72x72/1f966.png' });
  return (
    <div className="FridgeContentEmpty">
      <h3>Your fridge looks empty, why don't you try to add something?</h3>
      <p>To add an ingredient simply type it's name in the searchbar above.</p>
      <p>No thanks, just <a onClick={add} style={{ textDecoration: 'underline', cursor: 'pointer' }}>add <Ingredient name="broccoli" icon="//twemoji.maxcdn.com/2/72x72/1f966.png" /></a>.</p>
    </div>
  );
};
