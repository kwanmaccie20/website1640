import AppLayout from "@/layouts/AppLayout";
import { TypographyStylesProvider } from "@mantine/core";
import Link from "next/link";
import React from "react";

export default function Help() {
  return (
    <TypographyStylesProvider>
      <h1>Help</h1>
      <p>Here are some useful links for you</p>
      <h2>Terms and Conditions</h2>
      <Link href={"/terms"}> Terms and Conditions</Link>
      <h2>About</h2>
      <Link href={"/about"}> About</Link>
    </TypographyStylesProvider>
  );
}

Help.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Help",
    },
  };
}
