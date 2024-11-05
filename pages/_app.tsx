import "../styles.css"; // Import the global CSS here
import { AppProps } from "next/app";
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  <Head>
    <title>My Linux-Themed Explorer</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>
  return <Component {...pageProps} />;
}

export default MyApp;
