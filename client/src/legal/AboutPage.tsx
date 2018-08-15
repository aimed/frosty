import './AboutPage.scss';

import * as React from 'react';

import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export interface AboutPageProps {}

export const AboutPage: React.StatelessComponent<AboutPageProps> = props => {
    return (
      <div className="AboutPage">
        <div className="AboutPage__Nav"><Link to="/"><FaArrowLeft /> Home</Link></div>
        <div className="AboutPage__About">
          All emojis are provided by <a href="https://twemoji.twitter.com/" target="__blank">https://twemoji.twitter.com/</a>.
        </div>
      </div>
    );
};
