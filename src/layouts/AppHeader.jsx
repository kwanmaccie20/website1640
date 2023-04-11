import IdeaDetail from "@/components/IdeaDetail";
import { useNotification } from "@/hooks/notification";
import { getTimeElapsed } from "@/utils/getTimeElapsed";
import {
  ActionIcon,
  Alert,
  Box,
  Center,
  createStyles,
  Group,
  Header,
  Indicator,
  Loader,
  MediaQuery,
  Menu,
  Paper,
  Text,
  TextInput,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconBell,
  IconChevronDown,
  IconMenu2,
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/router";

const useStyle = createStyles((theme) => ({
  logo: {
    [theme.fn.smallerThan("md")]: {
      backgroundColor: "transparent",
    },
    [theme.fn.largerThan("md")]: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[2],
    },
  },
}));

export default function AppHeader({
  toggleDrawer,
  toggleNav,
  navOpened,
  title,
  user,
  name,
}) {
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { classes } = useStyle();
  const { toggleColorScheme } = useMantineColorScheme();
  const { data, isLoading, error, mutate } = useNotification(user?.id);

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

  const NotificationData = () => {
    if (isLoading)
      return (
        <Center>
          <Loader />
        </Center>
      );
    if (error)
      return (
        <Alert title="Error loading notification">
          Could not load notification, please try again
        </Alert>
      );
    if (!isLoading && data.length == 0) return "No notification yet";
    if (data)
      return data.map((n, i) => (
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
      ));
  };

  return (
    <Header height={80} className="border-none">
      <div className="flex justify-between items-center pr-4">
        {/* Menu button and logo */}
        <Group>
          <Box
            // style={{
            //   backgroundColor:
            //     theme.colorScheme === "dark"
            //       ? theme.colors.dark[6]
            //       : theme.colors.gray[2],
            // }}
            className={`relative flex justify-center items-center w-20 h-20 ${
              navOpened
                ? "lg:w-72"
                : "lg:w-20 transition-[width] ease duration-300"
            } ${classes.logo}`}
          >
            {/* logo here */}
            <Image src="/Logo.svg" fill alt="Logo" className="lg:p-5 p-2" />
          </Box>
          {/* In large screen */}
          <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
            <ActionIcon
              variant="light"
              size={"xl"}
              className="rounded-xl"
              onClick={toggleNav}
            >
              <IconMenu2 color={theme.primaryColor} size={24} />
            </ActionIcon>
          </MediaQuery>
          {/* In small screen */}
          <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
            <ActionIcon
              variant="light"
              size={"xl"}
              className="rounded-xl"
              onClick={toggleDrawer}
            >
              <IconMenu2 color={theme.primaryColor} size={24} />
            </ActionIcon>
          </MediaQuery>
          <h1 className="hidden font-semibold text-2xl sm:block">{title}</h1>
        </Group>
        {/* Avatar and notification */}
        <Group>
          <ActionIcon
            variant="light"
            size={"xl"}
            className="rounded-xl"
            onClick={() => toggleColorScheme()}
          >
            {theme.colorScheme == "dark" ? (
              <IconSun color={theme.primaryColor} />
            ) : (
              <IconMoonStars color={theme.primaryColor} />
            )}
          </ActionIcon>
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
            <Menu.Dropdown>{<NotificationData />}</Menu.Dropdown>
          </Menu>
          <Menu width={200} shadow="md">
            <Menu.Target>
              <UnstyledButton
                className="rounded-xl"
                component={Paper}
                withBorder
              >
                <Group>
                  <Image
                    src={`https://i.pravatar.cc/150?u=${user.email}`}
                    width={40}
                    height={40}
                    alt="Avt"
                    className="rounded-xl xl:w-12 xl:h-12"
                    style={{ border: "1px solid" }}
                  />
                  <div className="w-[120px] justify-evenly items-center hidden xl:flex">
                    <Text>{name}</Text>
                    <IconChevronDown strokeWidth={1.5} size={18} />
                  </div>
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Profile</Menu.Item>
              <Menu.Item
                color="red"
                onClick={
                  async () => {
                    const { error } = await supabase.auth.signOut();
                    if (!error) router.reload();
                  }
                  // router.push("/");
                }
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Header>
  );
}
