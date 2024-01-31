import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';

const link = createHttpLink({
  uri: 'http://localhost:5000',
  credentials: "include"
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
});


function App({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
