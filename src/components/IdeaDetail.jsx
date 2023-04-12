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
  UnstyledButton,
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
import FileData from "./FileData";

const getFileExt = (url) => {
  fetch(url, { method: "HEAD" }) // Send a HEAD request to retrieve only the response headers
    .then((response) => {
      if (response.ok) {
        const contentType = response.headers.get("content-type"); // Extract the Content-Type header from the response headers
        if (contentType) {
          const fileExtension = contentType.split("/").pop(); // Extract the file extension from the Content-Type header
          return fileExtension;
        } else {
          return null;
        }
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
};

export default function IdeaDetail({ idea }) {
  const theme = useMantineTheme();
  const user = useUser();
  const { count: countVote, isLoading: isCountVoteLoading } = useCountVotes(
    idea.id
  );
  const { comments, isLoading, mutate, error, count } = useIdeaComment(idea.id);
  const focusTrapRef = useFocusTrap(true);
  const supabase = useSupabaseClient();
  const [fileList, setFileList] = useState([]);
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
              src={
                idea.is_anonymous
                  ? "/user.avif"
                  : `https://i.pravatar.cc/150?u=${idea.staff.email}`
              }
              alt="avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
            <Stack spacing={0}>
              <Anchor>
                <Text className="font-medium">
                  {idea.is_anonymous
                    ? "Anonymous"
                    : `${idea.staff.first_name} ${idea.staff.last_name}`}
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

        <Text size="md" className="font-medium">
          {idea.title}
        </Text>
        <Text mb="sm">{idea.description}</Text>
        <div className="flex flex-col mb-1">
          {idea.idea_documents.map((d, i) => (
            <FileData key={i} url={d.url} fileName={d.file_name} index={i} />
          ))}
        </div>
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
            {idea.views} {idea.views !== 1 ? "views" : "view"} ・ {count}{" "}
            {count !== 1 ? "comments" : "comment"}
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
