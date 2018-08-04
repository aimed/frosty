import * as React from 'react';

// See: https://github.com/twitter/twemoji
const style: React.CSSProperties = {
  height: '1em',
  margin: '0 .05em 0 .1em',
  verticalAlign: '-0.1em',
  width: '1em',
}

export interface IngredientProps {
  name: string;
  icon?: string | null;
}

export const Ingredient: React.StatelessComponent<IngredientProps> = props => {
  const { name, icon } = props;
  return (
    <span className="Ingredient">
      {name}
      {icon && <img src={icon} alt={name} style={style} />}
    </span>
  );
};
