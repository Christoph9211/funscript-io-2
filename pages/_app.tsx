import { Router } from "next/router";
import Head from "next/head";
import { AppProps } from "next/dist/shared/lib/router/router";
import React, { ReactNode } from "react";
import NProgress from "nprogress";
import { Slide, ToastContainer } from "react-toastify";
import { KeonProvider } from "lib/hooks/useKeon";

import "../styles/app.css";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import Analytics from "lib/analytics/Analytics";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }: AppProps): ReactNode {
    return (
        <KeonProvider>
            <Head>
                <title>Funscript.io</title>
            </Head>
            <Component {...pageProps} />
            <ToastContainer
                position={"bottom-center"}
                theme={"dark"}
                transition={Slide}
                hideProgressBar={true}
                limit={3}
                autoClose={3000}
            />
            <Analytics />
        </KeonProvider>
    );
}

export default MyApp;
