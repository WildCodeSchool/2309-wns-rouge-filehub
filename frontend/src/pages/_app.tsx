import type {AppProps} from "next/app";
import dynamic from "next/dynamic";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import {ThemeProvider} from "@mui/material/styles";
import {theme} from "@/styles/theme";

const link = createHttpLink({
  uri: "http://localhost:5001",
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

function App({Component, pageProps}: AppProps): React.ReactNode {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), {ssr: false});
