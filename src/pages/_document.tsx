import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="dark">
      <Head />
      <link rel="icon" href="/favicon.ico" />
      <title>Invoice / RibeiroLabs</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;800&display=swap"
        rel="stylesheet"
      />
      <body className="prose max-w-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
