import * as React from 'react';

import { LoaderContainer } from './Loader';

/**
 * The module getter.
 * Example: () => import('MyComponent.tsx').then(module => module.MyComponent)
 * IMPORTANT: The getter has to be done this way, otherwise code splitting with webpack will not 
 *            work.
 */
export type ModuleGetter = () => Promise<React.ComponentClass | React.StatelessComponent>;

interface PageLoaderState {
  component: React.ComponentClass | React.StatelessComponent | null;
}

export interface PageLoaderConfig {
  hideLoader?: boolean;
}

export function pageLoader(getModule: ModuleGetter, config?: PageLoaderConfig) {
  return class P extends React.PureComponent<{}, PageLoaderState> {
    public state: PageLoaderState = {
      component: null
    };
  
    public componentDidMount() {
      getModule().then(component => this.setState({component}));
    }
  
    public render() {
      if (!this.state.component) {
        if (config && config.hideLoader) {
          return null;
        }
        return <LoaderContainer />;
      }

      const Component = this.state.component;
      return <Component />;
    }
  }
}
