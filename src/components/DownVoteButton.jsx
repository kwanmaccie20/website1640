import { Button, Text, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconThumbDown, IconThumbUp, IconX } from "@tabler/icons-react";
import React from "react";
import useSWR from "swr";
import { mutate as gMutate } from "swr";

export default function DownVoteButton({ idea }) {
  const user = useUser();
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();

  const { data, mutate } = useSWR(
    user ? `vote-${user?.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("voter_id", user?.id);
      // .is("is_upvote", false);
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) return data;
    }
  );
  const isVoted = data?.find((d) => d.idea_id == idea.id);
  const handleVote = async () => {
    if (isVoted && isVoted.is_upvote == false) {
      const { data, error } = await supabase
        .from("votes")
        .delete()
        .eq("idea_id", idea.id)
        .eq("voter_id", user?.id);
      if (error) {
        console.log(error);
        notifications.show({
          title: "Could not perform your action",
          color: "red",
          icon: <IconX />,
        });
      } else {
        mutate();
      }
    } else {
      const { data, error } = await supabase.from("votes").upsert(
        { is_upvote: false, idea_id: idea.id, voter_id: user?.id },
        {
          onConflict: "idea_id, voter_id",
          ignoreDuplicates: false,
        }
      );
      if (error) {
        console.log(error);
        notifications.show({
          title: "Could not perform your action",
          color: "red",
          icon: <IconX />,
        });
      } else {
        mutate();
        gMutate(`count-vote-${idea.id}`);
      }
    }
  };
  return (
    <Button
      variant="default"
      leftIcon={
        <IconThumbDown
          strokeWidth={1.5}
          color={isVoted && !isVoted.is_upvote ? undefined : "gray"}
          fill={
            isVoted && !isVoted.is_upvote
              ? theme.fn.primaryColor()
              : "transparent"
          }
        />
      }
      style={{ border: "none" }}
      onClick={(e) => {
        e.stopPropagation();
        handleVote();
      }}
    >
      <Text size={"sm"} className="font-medium" color="dimmed">
        Down vote
      </Text>
    </Button>
  );
}
