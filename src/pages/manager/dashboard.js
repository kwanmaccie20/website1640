import AppLayout from "@/layouts/AppLayout";
import React from "react";

export default function Dashboard() {
  return <h1>Dashboard</h1>;
}

Dashboard.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Dashboard",
    },
  };
}
