import "shepherd.js/dist/css/shepherd.css";
import "@/styles/shepherd-custom.css";
import "@/styles/globals.css";
import "@/styles/devices.css";
import "react-toastify/dist/ReactToastify.css";

import store from "@/utils/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <SessionProvider session={session}>
        <Provider store={store}>
          <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            style={{ marginTop: "40px" }}
          />
        </Provider>
      </SessionProvider>
    </>
  );
}
