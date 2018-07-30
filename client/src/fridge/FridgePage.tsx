import './FridgePage.scss';

import * as React from 'react';

import { WithApolloClient, WithApolloClientProps } from '../decorators/WithApolloClient';

import { Button } from '@hydrokit/button';
import { RouteComponentProps } from 'react-router';
import { Authenticator } from '../auth/Authenticator';
import { Logo } from '../logo/Logo';
import { FridgeContentWithData } from './FridgeContent';

export interface FridgePageProps extends WithApolloClientProps, RouteComponentProps<{}> {}

@WithApolloClient()
export class FridgePage extends React.PureComponent<FridgePageProps> {
  public signOut = () => {
    Authenticator.signOut();
    this.props.client.cache.reset().then(then => this.props.history.replace('/'));
  };

  public render() {
    return (
      <div className="FridgePage">
        <Header signOut={this.signOut} />
        <p style={{ textAlign: 'center' }}>Your fridge content will appear here shortly...</p>
        <FridgeContentWithData />
      </div>
    );
  }
};

function Header(props: { signOut: () => any; }) {
  return (
    <div className="FridgePage__Header">
      <Logo />
      <Button onClick={props.signOut}>Sign out</Button>
    </div>
  )
}