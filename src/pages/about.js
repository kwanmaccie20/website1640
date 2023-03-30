import AppLayout from "@/layouts/AppLayout";
import React from "react";

export default function About() {
  return <h1>About</h1>;
}

About.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "About",
    },
  };
}
