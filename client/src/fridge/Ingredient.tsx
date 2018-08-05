import './Ingredient.scss';

import * as React from 'react';

export interface IngredientProps {
  name: string;
  icon?: string | null;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export const Ingredient: React.StatelessComponent<IngredientProps> = props => {
  const { name, icon, onClick } = props;
  return (
    <span className="Ingredient" onClick={onClick}>
      {icon && <img src={icon} alt={name} />}
      <span>{name}</span>
    </span>
  );
};
