import * as React from 'react';

import { LegalPage } from './LegalPage';

export interface AboutPageProps { }

export const AboutPage: React.StatelessComponent<AboutPageProps> = () => {
  return (
    <LegalPage>
      All emojis are provided by <a href="https://twemoji.twitter.com/" target="__blank">https://twemoji.twitter.com/</a>.
    </LegalPage>
  );
};
