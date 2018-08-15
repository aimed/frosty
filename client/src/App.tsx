import * as React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { ApolloProvider } from "react-apollo";
import { hot } from 'react-hot-loader'
import { IconContext } from "react-icons/lib";
import { AuthenticatedRoute } from './auth/AuthenticatedRoute';
import { client } from './client';
import { FridgePage } from './fridge/FridgePage';
import { Layout } from './layout/Layout';
import { pageLoader } from './loader/PageLoader';
import { WelcomePageWithData } from './welcome/WelcomePage';

export class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <IconContext.Provider value={{ className: "icn" }}>
            <Layout>
              <Switch>
                <Route exact path="/(signin|signup|forgot-password|reset-password)" component={WelcomePageWithData} />
                <Route exact path="/privacy" component={pageLoader(() => import('./legal/PrivacyPolicyPage').then(m => m.PrivacyPolicyPage), { hideLoader: true })} />
                <Route exact path="/about" component={pageLoader(() => import('./legal/AboutPage').then(m => m.AboutPage), { hideLoader: true })} />
                <AuthenticatedRoute exact path="/(fridge)?" component={FridgePage} />
              </Switch>
            </Layout>
          </IconContext.Provider>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export const HotReloadingApp = hot(module)(App);
