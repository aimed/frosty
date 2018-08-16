import * as React from 'react';

import { classnames } from '@hydrokit/utils';
import { IngredientsSearch_allIngredients_edges } from './__generated__/IngredientsSearch';
import { Ingredient } from './Ingredient';

export interface FridgeIngredientInputSelectionBoxState { }
export interface FridgeIngredientInputSelectionBoxProps {
  suggestions: IngredientsSearch_allIngredients_edges[];
  selectIndex: number;
  onClick?: (index: number) => any;
}

export class FridgeIngredientInputSelectionBox extends React.PureComponent<FridgeIngredientInputSelectionBoxProps, FridgeIngredientInputSelectionBoxState> {
  public render() {
    const { suggestions, selectIndex, onClick } = this.props;
    const selectHandler = (index: number) => () => onClick && onClick(index);
    return <ul className="FridgeIngredientInputSelectionBox">
      {
        suggestions.map((edge, index) =>
          {
            const selected = selectIndex === index;
            const className = classnames(
              'FridgeIngredientInputSelectionBox__Item',
              selected && 'FridgeIngredientInputSelectionBox__Item--selected'
            );
            return (
              <li 
                key={edge.node.id} 
                className={className} 
                onClick={selectHandler(index)}
              >
                <Ingredient name={edge.node.name} icon={edge.node.icon} />
              </li>
            );
          }
        )
      }
    </ul>;
  }
}
