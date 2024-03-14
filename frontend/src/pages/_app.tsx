import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useQuery,
} from "@apollo/client";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/styles/theme";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { queryMe } from "@/graphql/queryMe";
import Head from "next/head";

const link = createHttpLink({
  uri: "http://localhost:5001",
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

const publicPages = ["/login", "/"];

function Auth(props: { children: ReactNode }) {
  const { data, loading, error, refetch } = useQuery(queryMe, {
    fetchPolicy: "no-cache",
  });
  const router = useRouter();

  const authVerif = async () => {
    try {
      await refetch();
      if (publicPages.includes(router.pathname) === false) {
        //page privée
        if (!data && !loading) {
          //pas connecté
          router.replace("/login");
        }
      }
    } catch (e) {
      if (router.pathname !== "/login" && error) {
        router.replace("/login");
      }
    }
  };

  useEffect(() => {
    authVerif();
  }, [router, error]);

  if (loading) {
    return <p>chargement</p>;
  }
  const loggedIn = true;
  if (!loggedIn) {
    return <p>not connected</p>;
  } else {
    return props.children;
  }
}

function App({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Auth>
          <Head>
            <title>FileHub</title>
            <link rel="icon" href="/favicon.png" />
          </Head>
          <Component {...pageProps} />
        </Auth>
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
