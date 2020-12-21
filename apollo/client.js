import { ApolloClient, InMemoryCache } from '@apollo/client';

const createApolloClient = () => {
  const link = () => {
    if (typeof window === 'undefined') {
      const { SchemaLink } = require('@apollo/client/link/schema');
      const { schema } = require('./schema');
      return new SchemaLink({ schema });
    } else {
      const { HttpLink } = require('@apollo/client/link/http');
      return new HttpLink({
        uri: '/api/graphql',
        credentials: 'same-origin',
      });
    }
  };

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: link(),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
