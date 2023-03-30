import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import "@/styles/globals.css";
import AppLayout from "@/layouts/AppLayout";
import { Inter, Poppins } from "next/font/google";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import Providers from "@/components/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Providers pageProps={pageProps}>
        <Notifications position="top-right" />
        <div className={`${poppins.variable} font-sans`}>
          <Component {...pageProps} />
        </div>
      </Providers>
    </>
  );
}
