import { getTimeElapsed } from "@/utils/getTimeElapsed";
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  HoverCard,
  Loader,
  Menu,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
  IconInfoCircle,
  IconMessageCircle2,
  IconDots,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import IdeaDetail from "./IdeaDetail";
import { notifications } from "@mantine/notifications";
import { useUser } from "@supabase/auth-helpers-react";
import CommentCard from "./CommentCard";
import { useIdeaComment } from "@/hooks/comment";
import { useUserProfile } from "@/hooks/userProfile";
import UpVoteButton from "./UpvoteButton";
import DownVoteButton from "./DownVoteButton";
import { useCountVotes } from "@/hooks/votes";

/*
  {
    "id": 10,
    "title": "fdsfdsfdsfdsf",
    "description": "fdsfdsfdfds",
    "author_id": "6a1d39b0-5dac-44e2-aab7-3dac6188d031",
    "is_anonymous": false,
    "campaign_id": 4,
    "created_at": "2023-04-09T16:14:57.355332+00:00",
    "tag_id": 3,
    "views": 0,
    "ranking_score": 0,
    "comments": [],
    "campaigns": {
      "id": 4,
      "name": "Pool party",
      "closure_date": "2023-04-30T17:00:00+00:00",
      "final_closure_date": "2023-05-31T17:00:00+00:00",
      "created_at": "2023-03-29T10:02:25.622461+00:00",
      "academic_id": 6,
      "academic_year": {
        "id": 6,
        "created_at": "2023-03-29T05:40:06.500054+00:00",
        "name": "2022-2023",
        "description": "",
        "is_enable": true
      }
    },
    "staff": {
      "id": "6a1d39b0-5dac-44e2-aab7-3dac6188d031",
      "first_name": "Kwan",
      "last_name": "Maccie",
      "email": "nk9793@gre.com"
    },
    "tags": {
      "id": 3,
      "name": "Student Life"
    },
    "idea_documents": [
      {
        "url": "6a1d39b0-5dac-44e2-aab7-3dac6188d031-1681056896046-0"
      },
      {
        "url": "6a1d39b0-5dac-44e2-aab7-3dac6188d031-1681056896047-1"
      }
    ]
  },
  },
*/

export default function IdeaCard({ idea }) {
  const theme = useMantineTheme();
  const user = useUser();
  const { profile } = useUserProfile(user?.id);
  const { comments, count, mutate, isLoading } = useIdeaComment(idea.id);
  const { count: countVote, isLoading: isCountVoteLoading } = useCountVotes(
    idea.id
  );
  return (
    <Card
      shadow="sm"
      py="sm"
      radius="md"
      withBorder={theme.colorScheme == "dark" ? false : true}
      className="cursor-pointer"
      onClick={() => {
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
          {count} {count !== 1 ? "comments" : "comment"}
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
          <Text size={"sm"} className="font-medium" color="dimmed">
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
