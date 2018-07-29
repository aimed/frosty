import { default as ApolloClient } from 'apollo-boost';

export const client = new ApolloClient({
  uri: '/graphql'
});
