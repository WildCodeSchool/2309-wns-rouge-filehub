import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useQuery,
} from "@apollo/client";
import { ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import { theme } from "@/styles/theme";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { queryMe } from "@/graphql/queryMe";
import Head from "next/head";
import { API_URL } from "@/config";
import { ToastContainer } from "react-toastify";

const link = createHttpLink({
  uri: `${API_URL}`,
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

const publicPages = [
  /^\/login$/,
  /^\/downloads(\/.*)?$/,
  /^\/forgot-password$/,
  /^\/reset-password$/,
  /^\/reset-password(\/.*)?$/,
  /^\/verify-account$/,
  /^\/verify-account(\/.*)?$/,
];

function Auth(props: { children: ReactNode }) {
  const { data, loading, error, refetch } = useQuery(queryMe, {
    fetchPolicy: "no-cache",
  });
  const router = useRouter();

  useEffect(() => {
    const authVerif = async () => {
      const isPublicPage = publicPages.some((regex) =>
        regex.test(router.pathname),
      );
      try {
        await refetch();
        if (!isPublicPage && !data?.user && !loading) {
          //page privée
          if (!data && !loading) {
            //pas connecté
            router.replace("/login");
          }
        }
      } catch (e) {
        if (!isPublicPage) {
          router.replace("/login");
        }
      }
    };

    authVerif();
  }, [router, error, refetch, data, loading]);

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

const themeResponsive = responsiveFontSizes(theme);

function App({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={themeResponsive}>
        <Auth>
          <Head>
            <title>FileHub</title>
            <link rel="icon" href="/favicon.png" />
          </Head>
          <Component {...pageProps} />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </Auth>
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
