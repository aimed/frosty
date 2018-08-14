import * as React from 'react';

import { LoaderContainer } from './Loader';

export interface AsyncPageState {
  component: React.ComponentClass | null;
}

export interface PageLoaderProps {
  /**
   * The module getter.
   * Example: () => import('MyComponent.tsx').then(module => module.MyComponent)
   * IMPORTANT: The getter has to be done this way, otherwise code splitting with webpack will not 
   *            work.
   */
  getModule: () => Promise<React.ComponentClass>;
}

export class PageLoader extends React.PureComponent<PageLoaderProps, AsyncPageState> {
  public state: AsyncPageState = {
    component: null
  };

  public componentDidMount() {
    this.props.getModule().then(component => this.setState({component}));
  }

  public render() {
    if (!this.state.component) {
      return <LoaderContainer />;
    }
    const Component = this.state.component;
    return <Component />;
  }
}
