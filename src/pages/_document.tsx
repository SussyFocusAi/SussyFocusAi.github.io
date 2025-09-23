// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Single favicon */}
        <link rel="icon" type="image/png" href="/icon.png" />

        {/* Optional metadata */}
        <meta name="application-name" content="FocusAI" />
        <meta name="theme-color" content="#8B5CF6" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
