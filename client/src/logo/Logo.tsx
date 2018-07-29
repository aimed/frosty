import './Logo.scss';

import * as React from 'react';

export interface LogoProps {}

export const Logo: React.StatelessComponent<LogoProps> = props => {
    return (
      <h1 className="Logo FrostyFont">Frosty</h1>
    );
};
