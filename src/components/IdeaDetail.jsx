import { useIdeaComment } from "@/hooks/comment";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Center,
  Checkbox,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconSend,
  IconThumbDown,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CommentCard from "./CommentCard";
import Link from "next/link";
import UpVoteButton from "./UpvoteButton";
import DownVoteButton from "./DownVoteButton";
import { useCountVotes } from "@/hooks/votes";

export default function IdeaDetail({ idea }) {
  const theme = useMantineTheme();
  const user = useUser();
  const { count: countVote, isLoading: isCountVoteLoading } = useCountVotes(
    idea.id
  );
  const { comments, isLoading, mutate, error, count } = useIdeaComment(idea.id);
  const focusTrapRef = useFocusTrap(true);
  const supabase = useSupabaseClient();
  const [commentValue, setCommentValue] = useState("");
  const [anon, setAnon] = useState(false);
  const handleComment = async (e) => {
    e.preventDefault();
    if (commentValue.length == 0) return;
    const { data, error } = await supabase
      .from("comments")
      .insert({
        idea_id: idea.id,
        author_id: user?.id,
        comment: commentValue,
        is_anonymous: anon,
      })
      .select("*")
      .single();
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    if (data) {
      setCommentValue("");
      setAnon(false);
      mutate();
    }
  };
  return (
    <div className="flex flex-col gap-3 w-full mt-5">
      <section>
        <Group position="apart" align="flex-start" spacing={0}>
          <Group spacing={"sm"}>
            <Image
              src={`https://i.pravatar.cc/150?u=${idea.staff.email}`}
              alt="avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
            <Stack spacing={0}>
              <Anchor>
                <Text className="font-medium">
                  {idea.staff.first_name} {idea.staff.last_name}
                </Text>
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
        </Group>
        <Divider />
      </section>
      <section className="flex flex-col">
        <div className="grow">
          {isLoading && (
            <Center>
              <Loader />
            </Center>
          )}
          {error && (
            <Alert color="red" title="Error loading ideas">
              An error occurs when loading comments, please try again later.
            </Alert>
          )}
          {count == 0 ? (
            <Text color="dimmed" size={"sm"} align="center">
              No comments yet.
            </Text>
          ) : (
            comments.map((comment, index) => (
              <CommentCard key={index} comment={comment} mutate={mutate} />
            ))
          )}
        </div>

        <Card className="justify-self-end sticky bottom-0 pb-5 w-full">
          <form ref={focusTrapRef} onSubmit={handleComment}>
            <TextInput
              variant="filled"
              radius="md"
              size="md"
              placeholder="Write your comment"
              autoFocus
              description={
                <Text>
                  By posting comments, you agree with our{" "}
                  <Anchor href="/terms" target="_blank">
                    Terms and Conditions
                  </Anchor>
                </Text>
              }
              data-autofocus
              rightSection={
                <ActionIcon onClick={handleComment}>
                  <IconSend
                    strokeWidth={1.5}
                    fill={theme.fn.primaryColor()}
                    color="transparent"
                  />
                </ActionIcon>
              }
              disabled={
                dayjs(idea.campaigns.final_closure_date) - dayjs(Date.now()) < 0
              }
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
            />
            <Group position="right" mt="sm">
              <Checkbox
                label={<Text color="dimmed">Comment anonymously</Text>}
                checked={anon}
                onChange={(e) => setAnon(e.currentTarget.checked)}
              />
            </Group>
          </form>
        </Card>
      </section>
    </div>
  );
}
