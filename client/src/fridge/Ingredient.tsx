import './Ingredient.scss';

import * as React from 'react';

import gql from 'graphql-tag';

export interface IngredientProps {
  name: string;
  icon?: string | null;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export const IngredientFragment = gql`
fragment IngredientFragment on Ingredient {
  name
  icon
  unit
}
`;

export const Ingredient: React.StatelessComponent<IngredientProps> = props => {
  const { name, icon, onClick } = props;
  return (
    <span className="Ingredient" onClick={onClick}>
      {icon && <img src={icon} alt={name} />}
      <span>{name}</span>
    </span>
  );
};
