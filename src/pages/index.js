import IdeaCard from "@/components/IdeaCard";
import { mockIdeas } from "@/constants/mockIdeas";
import { Group, Stack, Text, TextInput } from "@mantine/core";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack>
        {mockIdeas.map((idea, index) => (
          <IdeaCard idea={idea} key={index} />
        ))}
      </Stack>
    </>
  );
}
