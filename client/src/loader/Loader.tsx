import './Loader.scss';

import * as React from 'react';

export interface LoaderProps { }

export function Loader(props: LoaderProps) {
  return (
    <span className="Loader">
      <img src="//twemoji.maxcdn.com/2/72x72/1f966.png" />
      <img src="//twemoji.maxcdn.com/2/72x72/1f353.png" />
      <img src="//twemoji.maxcdn.com/2/72x72/1f34c.png" />
    </span>
  );
}

export function LoaderContainer() {
  return (
    <div className="LoaderContainer">
      <Loader />
    </div>
  );
}
