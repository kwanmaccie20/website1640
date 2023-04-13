import { useIdeaComment } from "@/hooks/comment";
import { useUserProfile } from "@/hooks/userProfile";
import { useCountVotes } from "@/hooks/votes";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Group,
  HoverCard,
  Loader,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconMessageCircle2, IconThumbUpFilled } from "@tabler/icons-react";
import Image from "next/image";
import CommentCard from "./CommentCard";
import DownVoteButton from "./DownVoteButton";
import IdeaDetail from "./IdeaDetail";
import UpVoteButton from "./UpvoteButton";

export default function IdeaCard({ idea, mutateIdea }) {
  const theme = useMantineTheme();
  const user = useUser();
  const { profile } = useUserProfile(user?.id);
  const { comments, count, mutate, isLoading } = useIdeaComment(idea.id);
  const { count: countVote, isLoading: isCountVoteLoading } = useCountVotes(
    idea.id
  );
  const supabase = useSupabaseClient();
  const debounceViewCount = (func, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleViewInc = async () => {
    const { data, error } = await supabase
      .from("ideas")
      .update({ views: idea.views + 1 })
      .eq("id", idea.id)
      .select("id");
    if (data) mutateIdea();
  };

  const debouncedFunction = debounceViewCount(handleViewInc, 1000 * 60); // 1 min

  return (
    <Card
      shadow="sm"
      py="sm"
      radius="md"
      withBorder={theme.colorScheme == "dark" ? false : true}
      className="cursor-pointer"
      onClick={async () => {
        debouncedFunction();
        modals.open({
          title: <b className="py-3">{idea.title}</b>,
          children: <IdeaDetail idea={idea} />,
          size: "100%",
          padding: "15px 15px 0 15px",
        });
      }}
    >
      <Group position="apart" align="flex-start" spacing={0} mb="sm">
        <Group spacing={"sm"}>
          <Image
            src={
              idea.is_anonymous
                ? "/user.avif"
                : `https://i.pravatar.cc/150?u=${idea.staff.email}`
            }
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full ring-[1px] ring-slate-500/50 p-[1px]"
          />
          <Stack spacing={0}>
            <Anchor>
              <HoverCard shadow="md" openDelay={2000}>
                <HoverCard.Target>
                  <Text className="font-medium">
                    {idea.is_anonymous
                      ? "Anonymous"
                      : `${idea.staff.first_name} ${idea.staff.last_name}`}
                  </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown
                  hidden={
                    !idea.is_anonymous || profile?.roles?.title != "qa_manager"
                  }
                >
                  <Text className="font-medium">
                    {idea.staff.first_name} {idea.staff.last_name}
                  </Text>
                  <Text className="font-medium">{idea.staff.email}</Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Anchor>
            <Text size={"xs"} color="dimmed">
              {getTimeElapsed(idea.created_at)} ・ on {idea.campaigns.name}
            </Text>
          </Stack>
        </Group>
        <Badge size="md" mt={3}>
          # {idea.tags.name}
        </Badge>
      </Group>

      <Text my="md" size="md">
        {idea.title}
      </Text>
      <Group position="apart" mb="xs">
        <Group spacing={0}>
          <ActionIcon
            className="cursor-default"
            variant="transparent"
            color={theme.fn.primaryColor()}
            title="Number of votes"
          >
            <IconThumbUpFilled strokeWidth={1.5} />
          </ActionIcon>
          <Text color="dimmed" size="sm">
            {isCountVoteLoading
              ? "... up votes"
              : countVote !== 1
              ? `${countVote} up votes`
              : `${countVote} up vote`}
          </Text>
        </Group>
        <Text color="dimmed" size="sm">
          {idea.views} {idea.views !== 1 ? "views" : "view"} ・ {count}{" "}
          {count !== 1 ? "comments" : "comment"}
        </Text>
      </Group>
      <Divider />
      <Group grow py={5}>
        <UpVoteButton idea={idea} />
        <DownVoteButton idea={idea} />
        <Button
          variant="default"
          leftIcon={<IconMessageCircle2 strokeWidth={1.5} color="gray" />}
          style={{ border: "none" }}
        >
          <Text
            size={"sm"}
            className="font-medium hidden xs:block"
            color="dimmed"
          >
            Comments
          </Text>
        </Button>
      </Group>
      <Divider hidden={count == 0} />
      {isLoading && (
        <Center>
          <Loader />
        </Center>
      )}
      {comments?.length !== 0 && (
        <CommentCard comment={comments[0]} mutate={mutate} />
      )}
    </Card>
  );
}
