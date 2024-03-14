import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          src="https://cdn.tolt.io/tolt.js"
          data-tolt="735ad833-3a7e-4718-bf0d-5bdaaeac26dd"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
