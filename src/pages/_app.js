import Providers from "@/components/Providers";
import { RouterTransition } from "@/components/RouterTransition";
import "@/styles/globals.css";
import { Notifications } from "@mantine/notifications";
import { Poppins } from "next/font/google";
import Head from "next/head";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
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
        <RouterTransition />
        <div className={`${poppins.variable} font-sans`}>
          {getLayout(<Component {...pageProps} />)}
        </div>
      </Providers>
    </>
  );
}
