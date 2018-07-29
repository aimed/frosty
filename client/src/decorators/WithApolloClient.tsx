import * as React from 'react';

import { ApolloClient } from 'apollo-client';
import { ApolloConsumer } from "react-apollo";

export interface WithApolloClientProps {
  client: ApolloClient<any>
};

export function WithApolloClient() {
  return <
    P,
    T extends React.ComponentClass<P & WithApolloClientProps, {}>
  >(wrapped: T) => {
    const Wrapped = wrapped as any;
    return class R extends React.Component<Exclude<P, WithApolloClientProps>, {}> {
      public render() {
        return (<ApolloConsumer>{client => <Wrapped {...this.props} client={client} />}</ApolloConsumer>)
      }
    } as any as T;
  }
}
