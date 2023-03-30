import AppLayout from "@/layouts/AppLayout";
import React from "react";

export default function Help() {
  return <h1>Help</h1>;
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
