import '../styles/global.css'
import { ApolloProvider } from '@apollo/client';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { useMemo } from "react";
import createApolloClient from '../apollo/client';

const App = ({ Component, pageProps }) => {
  const apolloClient = useMemo(() => {
    const apolloClient = createApolloClient();

    apolloClient.cache.restore(pageProps.initialApolloState);

    return apolloClient;
  }, [pageProps.initialApolloState]);

  return (
    <NextAuthProvider session={ pageProps.session }>
      <ApolloProvider client={ apolloClient }>
        <Component { ...pageProps } />
      </ApolloProvider>
    </NextAuthProvider>
  )
}

export default App;
