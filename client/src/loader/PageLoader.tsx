import * as React from 'react';

import { LoaderContainer } from '../loader/Loader';

export interface AsyncPageState {
  component: React.ComponentClass | null;
}

export interface AsyncPageProps {
  getModule: () => Promise<React.ComponentClass>;
}

export class PageLoader extends React.PureComponent<AsyncPageProps, AsyncPageState> {
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
