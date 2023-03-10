import "@/styles/globals.css";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import Head from "next/head";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (val) =>
    setColorScheme(val || colorScheme == "dark" ? "light" : "dark");
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme: colorScheme, primaryColor: "cyan" }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
