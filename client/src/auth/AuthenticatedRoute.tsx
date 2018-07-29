import * as React from 'react';

import { Redirect, Route, RouteProps } from 'react-router';

import { Authenticator } from './Authenticator';

export interface AuthenticatedRouteProps extends RouteProps {
  /**
   * The location to redirect to if not authenticated
   */
  redirectTo?: string;
}

export const AuthenticatedRoute: React.StatelessComponent<AuthenticatedRouteProps> = props => {
  const { component, children, render, redirectTo = '/signin', ...routeProps} = props;
  return (
    // tslint:disable-next-line:jsx-no-lambda
    <Route {...routeProps} render={(innerProps) => {
      if (!Authenticator.isAuthenticated) {
        return <Redirect to={redirectTo} />;
      }

      if (component) {
        const Component = component;
        return <Component {...innerProps} />
      }

      if (render) {
        return render(innerProps);
      }

      if (children) {
        return children;
      }
      
      return null;
    }} />
  );
};
