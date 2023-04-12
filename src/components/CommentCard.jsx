import { useUserProfile } from "@/hooks/userProfile";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import {
  ActionIcon,
  Anchor,
  Card,
  Group,
  HoverCard,
  Menu,
  Spoiler,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IconCheck, IconDots, IconX } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

export default function CommentCard({ comment, mutate }) {
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const user = useUser();
  const { profile } = useUserProfile(user?.id);
  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <>
          <Text size="sm" color="dimmed">
            Are you sure to delete comment?
          </Text>
        </>
      ),
      modalId: `comment-${comment.id}`,
      labels: { cancel: "Cancel", confirm: "Delete" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const { data, error } = await supabase
          .from("comments")
          .delete()
          .eq("id", comment.id);
        if (error) {
          console.log(error);
          notifications.show({
            title: "Could not delete comment",
            message: "An error occurs when deleting comment",
            color: "red",
            icon: <IconX />,
          });
          modals.close(`comment-${comment.id}`);
        } else {
          notifications.show({
            title: "Comment deleted successfully",
            icon: <IconCheck />,
          });
          modals.close(`comment-${comment.id}`);
          mutate();
        }
      },
    });
  };
  return (
    <div className="flex gap-2 items-start my-3">
      <Group spacing={"sm"} pt={1}>
        <Image
          src={
            comment.is_anonymous
              ? "/user.avif"
              : `https://i.pravatar.cc/150?u=${comment.staff.email}`
          }
          alt="avatar"
          width={36}
          height={36}
          className="rounded-full ring-[1px] ring-slate-500/50 p-[1px]"
        />
      </Group>
      <Card
        style={{
          background:
            theme.colorScheme == "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
        }}
        className="w-fit px-3 py-2 rounded-lg rounded-tl-none"
      >
        <Group spacing={"sm"}>
          <Anchor>
            <HoverCard shadow="md" openDelay={2000}>
              <HoverCard.Target>
                <Text className="font-medium">
                  {comment.is_anonymous
                    ? "Anonymous"
                    : `${comment.staff.first_name} ${comment.staff.last_name}`}
                </Text>
              </HoverCard.Target>
              <HoverCard.Dropdown
                hidden={
                  !comment.is_anonymous || profile?.roles?.title != "qa_manager"
                }
              >
                <Text className="font-medium">
                  {comment.staff.first_name} {comment.staff.last_name}
                </Text>
                <Text className="font-medium">{comment.staff.email}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Anchor>
          <Text size={"xs"} color="dimmed">
            {getTimeElapsed(comment.created_at)}
          </Text>
        </Group>
        <Spoiler
          maxHeight={100}
          onClick={(e) => e.stopPropagation()}
          showLabel="See more"
          hideLabel="Collapse"
        >
          <Text size={"sm"} className="text-ellipsis overflow-hidden">
            {comment.comment}
          </Text>
        </Spoiler>
      </Card>
      {comment.staff.id === user?.id && (
        <Menu width={200}>
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              className="self-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <IconDots strokeWidth={1} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              color="red"
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
}
