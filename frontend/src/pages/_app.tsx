import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, useQuery } from '@apollo/client';
import { ReactNode, useEffect } from "react";
import { queryMe } from "@/query&mutations";
import { useRouter } from "next/router";

const link = createHttpLink({
  uri: 'http://localhost:5000',
  credentials: "include"
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
});

const publicPages = ["/signUp", "/signIn", "/", "/ads/[id]"];

function Auth(props: { children: ReactNode}){
  const {data, loading, error} = useQuery(queryMe);
  const router = useRouter();

  useEffect(()=>{
    if(publicPages.includes(router.pathname) === false){
      //page privée
      if(error){
        //pas connecté
        router.replace("/signIn");
      }
    }
  }, [router, error])

  if(loading){
    return <p>chargement</p>
  }
  const loggedIn = true;
  if(!loggedIn){
    return <p>not connected</p>
  } else {
    return props.children;
  }
}

function App({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <ApolloProvider client={client}>
      <Auth>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Auth>
    </ApolloProvider>
  )
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
