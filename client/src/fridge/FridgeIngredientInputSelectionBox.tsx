import * as React from 'react';

import { IngredientsSearch_allIngredients_edges } from './__generated__/IngredientsSearch';
import { Ingredient } from './Ingredient';

export interface FridgeIngredientInputSelectionBoxState { }
export interface FridgeIngredientInputSelectionBoxProps {
  suggestions: IngredientsSearch_allIngredients_edges[];
  selectIndex: number;
}

export class FridgeIngredientInputSelectionBox extends React.PureComponent<FridgeIngredientInputSelectionBoxProps, FridgeIngredientInputSelectionBoxState> {
  public render() {
    const { suggestions, selectIndex } = this.props;
    return <ul className="FridgeIngredientInputSelectionBox">
      {
        suggestions.map((edge, index) =>
          {
            const selected = selectIndex === index;
            const className = 'FridgeIngredientInputSelectionBox__Item ' + (selected ? 'FridgeIngredientInputSelectionBox__Item--selected' : '');
            return (
              <li key={edge.node.id} className={className}><Ingredient name={edge.node.name} icon={edge.node.icon} /></li>
            );
          }
        )
      }
    </ul>;
  }
}
