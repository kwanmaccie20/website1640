import IdeaCard from "@/components/IdeaCard";
import NewIdeaForm from "@/components/NewIdeaForm";
import { mockIdeas } from "@/constants/mockIdeas";
import { useUserProfile } from "@/hooks/userProfile";
import AppLayout from "@/layouts/AppLayout";
import { Select, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function Home() {
  const user = useUser();
  const { profile } = useUserProfile(user?.id);
  const [filter, setFilter] = useState("Latest ideas");
  const handleCreateNewIdea = () => {
    modals.open({
      title: "Create New Idea",
      children: <NewIdeaForm />,
    });
  };
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <TextInput
          variant="filled"
          placeholder={`What's on your mind ${
            profile ? profile?.first_name : ""
          }?`}
          aria-label="New Idea"
          className="grow order-2 sm:order-1"
          size="md"
          readOnly
          onClick={handleCreateNewIdea}
        />
        <Select
          data={["Latest ideas", "Most view ideas", "Most popular ideas"]}
          placeholder="Latest"
          className=" order-1 w-[200px] self-end sm:w-auto"
          value={filter}
          size="md"
          onChange={setFilter}
        />
      </div>
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
