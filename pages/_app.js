import Head from "next/head";
import Router from "next/router";
import { useState, useEffect } from "react";

import { UserProvider } from "@auth0/nextjs-auth0";

import "../styles/normalize.css";
import "../styles/styles.css";

import Layout from "../components/Layout";
import FlowLoader from "../components/FlowLoader";

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setIsLoading(true);
    };
    const end = () => {
      setIsLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="Minimalist Productivity App" />
        <meta name="keywords" content="productivity" />
        <meta name="theme-color" content="#f75858" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta property="og:title" content="Flow" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flowapp.vercel.app" />
        <meta
          property="og:description"
          content="The Minimalist Productivity App"
        />
        <meta
          property="og:description"
          content="The Minimalist Productivity App"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://getintoflow.vercel.app/cover.png"
        />
        <meta name="twitter:title" content="Flow" />
        <meta
          name="twitter:description"
          content="The Minimalist Productivity App"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <UserProvider>
        <Layout>
          {isLoading ? <FlowLoader /> : <Component {...pageProps} />}
        </Layout>
      </UserProvider>
    </>
  );
}

export default MyApp;
