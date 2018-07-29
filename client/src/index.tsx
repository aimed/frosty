import './index.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { HotReloadingApp } from './App';
import { register as registerServiceWorker } from './registerServiceWorker';

ReactDOM.render(
  <HotReloadingApp />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
