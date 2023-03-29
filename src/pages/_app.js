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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

// const inter = Inter({
//   subsets: ["latin", "vietnamese"],
//   variable: "--font-inter",
// });

export default function App({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (val) =>
    setColorScheme(val || colorScheme == "dark" ? "light" : "dark");
  const router = useRouter();
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme: colorScheme,
              primaryColor: "teal",
              fontFamily: poppins.style.fontFamily,
              colors: {
                dark: [
                  "#f5f7fa",
                  "#ebeff5",
                  "#ccd3e1",
                  "#afb4c9",
                  "#777e9c",
                  "#24292D",
                  "#1a1e22",
                  "#13161a",
                  "#0d0e11",
                  "#070708",
                ],
              },
            }}
          >
            <ModalsProvider>
              <Notifications position="top-right" />
              <div className={`${poppins.variable} font-sans`}>
                {router.pathname.startsWith("/auth") ? (
                  <Component {...pageProps} />
                ) : (
                  <AppLayout>
                    <Component {...pageProps} />
                  </AppLayout>
                )}
              </div>
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionContextProvider>
    </>
  );
}
