import './Ingredient.scss';

import * as React from 'react';

export interface IngredientProps {
  name: string;
  icon?: string | null;
}

export const Ingredient: React.StatelessComponent<IngredientProps> = props => {
  const { name, icon } = props;
  return (
    <span className="Ingredient">
      {icon && <img src={icon} alt={name} />}
      <span>{name}</span>
    </span>
  );
};
