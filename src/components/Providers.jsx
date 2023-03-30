import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Poppins } from "next/font/google";
import React, { useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function Providers({ children, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (val) =>
    setColorScheme(val || colorScheme == "dark" ? "light" : "dark");
  return (
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
          <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </SessionContextProvider>
  );
}
