import React from 'react'
import '../styles/global.css'
import { ThemeProvider } from '@material-ui/core'
import theme from '../styles/theme'
import { ApolloProvider } from '@apollo/client'
import { Provider as NextAuthProvider } from 'next-auth/client'
import { useMemo } from "react"
import createApolloClient from '../apollo/client'

const App = ({ Component, pageProps }) => {
  const apolloClient = useMemo(() => {
    const apolloClient = createApolloClient()

    apolloClient.cache.restore(pageProps.initialApolloState)

    return apolloClient
  }, [pageProps.initialApolloState])

  return (
    <NextAuthProvider session={ pageProps.session }>
      <ApolloProvider client={ apolloClient }>
        <ThemeProvider theme={theme}>
          <Component { ...pageProps } />
        </ThemeProvider>
      </ApolloProvider>
    </NextAuthProvider>
  )
}

export default App
