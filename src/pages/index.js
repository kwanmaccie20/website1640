import IdeaCard from "@/components/IdeaCard";
import NewIdeaForm from "@/components/NewIdeaForm";
import { mockIdeas } from "@/constants/mockIdeas";
import { useIdeaFilter } from "@/hooks/idea";
import { useUserProfile } from "@/hooks/userProfile";
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
  Textarea,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const user = useUser();
  const [pageIndex, setPageIndex] = useState(0);
  const supabase = useSupabaseClient();
  const { profile } = useUserProfile(user?.id);
  const [filter, setFilter] = useState("Latest ideas");
  const [searchString, setSearchString] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [campaignData, setCampaignData] = useState([]);
  const [campaignFilter, setCampaignFilter] = useState(0);
  const { ideas, count, isLoading, isValidating, error, mutate } =
    useIdeaFilter(pageIndex, filter, campaignFilter, searchFilter);
  const handleCreateNewIdea = () => {
    modals.open({
      title: "Create New Idea",
      children: <NewIdeaForm mutate={mutate} />,
    });
  };
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, name")
        .gte("final_closure_date", new Date(Date.now()).toISOString());
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
            data={["Latest ideas", "Most view ideas", "Most popular ideas"]}
            placeholder="Latest"
            value={filter}
            size="md"
            aria-label="Filter ideas"
            onChange={setFilter}
          />
          <Select
            data={campaignData.map((c) => ({ label: c.name, value: c.id }))}
            value={campaignFilter}
            size="md"
            aria-label="Filter based on campaign"
            onChange={setCampaignFilter}
          />
        </Group>
      </div>
      <Textarea
        minRows={2}
        maxRows={2}
        variant="filled"
        placeholder={`What's on your mind ${
          profile ? profile?.first_name : ""
        }?`}
        aria-label="New Idea"
        size="md"
        mb={"md"}
        readOnly
        radius={"md"}
        onClick={handleCreateNewIdea}
      />
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
