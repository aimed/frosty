import './LegalPage.scss';

import * as React from 'react';

import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export interface LegalPageProps {}

export const LegalPage: React.StatelessComponent<LegalPageProps> = props => {
    return (
      <div className="LegalPage">
        <div className="LegalPage__Nav"><Link to="/"><FaHome /> Home</Link></div>
        <div className="LegalPage__Content">{props.children}</div>
      </div>
    );
};
