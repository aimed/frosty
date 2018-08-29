import './FridgePage.scss';

import * as React from 'react';

import { withApollo, WithApolloClient } from 'react-apollo';

import { Button } from '@hydrokit/button';
import { PopoverMenu } from '@hydrokit/popover-menu/build';
import { FaCog } from 'react-icons/fa';
import { RouteComponentProps } from 'react-router';
import { Authenticator } from '../auth/Authenticator';
import { FridgeRemote } from "./FridgeRemote";

export interface FridgePageProps extends WithApolloClient<{}>, RouteComponentProps<{}> {}

export class FridgePage extends React.PureComponent<FridgePageProps> {
  public signOut = () => {
    Authenticator.signOut();
    this.props.client.cache.
    reset()
    .then(
      () => this.props.history.replace('/')
    );
  };

  public render() {
    return (
      <div className="FridgePage">
        <Header signOut={this.signOut} />
        <FridgeRemote client={this.props.client} />
      </div>
    );
  }
};

function Header(props: { signOut: () => any; }) {
  return (
    <div className="FridgePage__Header">
      <span />
      <PopoverMenu label={<FaCog />} alignHorizontal="right">
        <Button onClick={props.signOut}>Sign out</Button>
      </PopoverMenu>
    </div>
  )
}

export const FridgePageWithData = withApollo(FridgePage);