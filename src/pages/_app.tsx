// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        {/* Website Icon (Favicon) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* App Metadata */}
        <meta name="application-name" content="FocusAI" />
        <meta name="theme-color" content="#8B5CF6" />
      </Head>
      
      <Component {...pageProps} />
    </SessionProvider>
  );
}