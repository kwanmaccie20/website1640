import IdeaCard from "@/components/IdeaCard";
import { useArchivedIdeaFilter } from "@/hooks/idea";
import AppLayout from "@/layouts/AppLayout";
import {
  Alert,
  Center,
  Group,
  Loader,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";

export default function Archived() {
  const [pageIndex, setPageIndex] = useState(0);
  const supabase = useSupabaseClient();
  const [filter, setFilter] = useState("Most popular ideas");
  const [searchString, setSearchString] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [campaignData, setCampaignData] = useState([]);
  const [campaignFilter, setCampaignFilter] = useState(0);
  const { ideas, count, isLoading, isValidating, error, mutate } =
    useArchivedIdeaFilter(pageIndex, filter, campaignFilter, searchFilter);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, name")
        .lt("final_closure_date", new Date(Date.now()).toISOString());
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) {
        setCampaignData([...data, { id: 0, name: "All campaigns" }]);
      }
    })();
  }, [supabase]);

  useEffect(() => {
    const timeout = setTimeout(() => setSearchFilter(searchString), 500);
    return () => clearTimeout(timeout);
  }, [searchString]);
  useEffect(() => {
    mutate();
  }, [searchFilter, filter, campaignFilter, pageIndex, mutate]);
  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <TextInput
          placeholder="Search ideas"
          size="md"
          value={searchString}
          className="grow order-2 md:order-1"
          onChange={(e) => setSearchString(e.target.value)}
        />
        <Group className="order-1 md:w-auto self-end" spacing={5} grow>
          <Select
            data={["Most view ideas", "Most popular ideas"]}
            placeholder="Latest"
            value={filter}
            size="md"
            onChange={setFilter}
          />
          <Select
            data={campaignData.map((c) => ({ label: c.name, value: c.id }))}
            value={campaignFilter}
            size="md"
            onChange={setCampaignFilter}
          />
        </Group>
      </div>
      <Stack>
        {isLoading && (
          <Center>
            <Loader />
          </Center>
        )}
        {error && (
          <Alert color="red" title="Error loading ideas">
            An error occurs when loading ideas, please try again later.
          </Alert>
        )}
        {ideas?.length == 0 && !isLoading ? (
          <Text color="dimmed" size={"sm"} align="center">
            No ideas found.
          </Text>
        ) : (
          ideas.map((idea, index) => (
            <IdeaCard key={index} idea={idea} mutateIdea={mutate} />
          ))
        )}
      </Stack>
      <Group position="right" my="lg">
        <Pagination
          total={Math.ceil(count / 5)}
          value={pageIndex + 1}
          onChange={(value) => setPageIndex(value - 1)}
        />
      </Group>
    </>
  );
}

Archived.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Archived",
    },
  };
}
