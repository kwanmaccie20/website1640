import { Title } from "@mantine/core";
import React from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"] });

export default function Logo() {
  return (
    <Title className={montserrat.className} order={5}>
      NEXT University
    </Title>
  );
}
