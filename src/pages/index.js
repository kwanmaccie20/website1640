import IdeaCard from "@/components/IdeaCard";
import { mockIdeas } from "@/constants/mockIdeas";
import AppLayout from "@/layouts/AppLayout";
import { Stack } from "@mantine/core";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Stack>
        {mockIdeas.map((idea, index) => (
          <IdeaCard idea={idea} key={index} />
        ))}
      </Stack>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Explore",
    },
  };
}
