import * as React from 'react';

import { BrowserRouter, Route } from 'react-router-dom'

import { ApolloProvider } from "react-apollo";
import { hot } from 'react-hot-loader'
import { IconContext } from "react-icons";
import { AuthenticatedRoute } from './auth/AuthenticatedRoute';
import { client } from './client';
import { FridgePage } from './fridge/FridgePage';
import { WelcomePageWithData } from './welcome/WelcomePage';

export class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <IconContext.Provider value={{ className: "icn" }}>
            <Route exact path="/(signin|signup|forgot-password)" component={WelcomePageWithData} />
            <AuthenticatedRoute exact path="/(fridge)?" component={FridgePage} />
          </IconContext.Provider>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export const HotReloadingApp = hot(module)(App);
