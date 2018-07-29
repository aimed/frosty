import * as React from 'react';

import { BrowserRouter, Route } from 'react-router-dom'

import { ApolloProvider } from "react-apollo";
import { hot } from 'react-hot-loader'
import { AuthenticatedRoute } from './auth/AuthenticatedRoute';
import { client } from './client';
import { FridgePage } from './fridge/FridgePage';
import { WelcomePage } from './welcome/WelcomePage';

export class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <Route exact path="/(signin|signup|forgot-password)" component={WelcomePage} />
          <AuthenticatedRoute exact path="/(fridge)?" component={FridgePage} />
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export const HotReloadingApp = hot(module)(App);
