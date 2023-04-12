import { Fragment, useEffect, useState } from "react";
import IdeaDetail from "./IdeaDetail";
import { useNotification } from "@/hooks/notification";
import { modals } from "@mantine/modals";
import { IconBell } from "@tabler/icons-react";

const { getTimeElapsed } = require("@/utils/getTimeElapsed");
const {
  Center,
  Loader,
  Alert,
  Menu,
  Indicator,
  Box,
  Text,
  ActionIcon,
  ScrollArea,
  useMantineTheme,
  UnstyledButton,
} = require("@mantine/core");
const { useSupabaseClient, useUser } = require("@supabase/auth-helpers-react");

export default function NotificationBox() {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const user = useUser();
  const { data, isLoading, error, mutate } = useNotification(user?.id);
  useEffect(() => {
    if (user) {
      const newNotification = supabase
        .channel(`notification-${user?.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `staff_id=eq.${user?.id}`,
          },
          (payload) => {
            mutate([...data, payload]);
          }
        )
        .subscribe();
      return () => newNotification.unsubscribe();
    }
  }, [user]);
  const handleOpenNotification = async (target, notificationId) => {
    const { data, count } = await supabase
      .from("ideas")
      .select(
        "*, staff!ideas_author_id_fkey(id, first_name, last_name, email), campaigns!inner(*, academic_year(*)), tags(*), idea_documents(*))",
        { count: "exact" }
      )
      .eq("id", target)
      .single();
    if (data) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_new: false })
        .eq("id", notificationId);
      if (!error) {
        mutate();
      }
      modals.open({
        title: <b className="py-3">{data.title}</b>,
        children: <IdeaDetail idea={data} />,
        size: "100%",
        padding: "15px 15px 0 15px",
      });
    }
  };

  return (
    <Menu width={350} shadow="md" position="bottom-end">
      <Menu.Target>
        <Indicator
          position="top-end"
          processing
          disabled={!data?.some((v) => v.is_new == true)}
        >
          <ActionIcon variant="light" size={"xl"} className="rounded-xl">
            <IconBell color={theme.primaryColor} size={24} />
          </ActionIcon>
        </Indicator>
      </Menu.Target>
      <Menu.Dropdown>
        <ScrollArea.Autosize mah={"40vh"}>
          {isLoading && (
            <Center>
              <Loader />
            </Center>
          )}
          {error && (
            <Alert title="Error loading notification">
              Could not load notification, please try again
            </Alert>
          )}
          {!isLoading && data && data?.length == 0 && (
            <Center>
              <Text color="dimmed" my="md">
                No notification yet
              </Text>
            </Center>
          )}
          {data &&
            data.map((n, i) => (
              <Menu.Item
                key={i}
                onClick={() => handleOpenNotification(n.target, n.id)}
              >
                <Indicator position="middle-end" disabled={!n.is_new}>
                  <Box>
                    <Text size={"sm"}>{n.message}</Text>
                    <Text color="dimmed" size={"xs"}>
                      {getTimeElapsed(n.created_at)}
                    </Text>
                  </Box>
                </Indicator>
              </Menu.Item>
            ))}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
}
