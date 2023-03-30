import {
  ActionIcon,
  Box,
  Group,
  Header,
  MediaQuery,
  Menu,
  Paper,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconBell, IconChevronDown, IconMenu2 } from "@tabler/icons-react";
import Image from "next/image";

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
  return (
    <Header height={80} className="border-none">
      <div className="flex justify-between items-center pr-4">
        {/* Menu button and logo */}
        <Group>
          <Box
            style={{
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[2],
            }}
            className={` relative flex justify-center items-center w-20 h-20 ${
              navOpened
                ? "lg:w-72"
                : "lg:w-20 transition-[width] ease duration-300"
            }`}
          >
            {/* logo here */}
            <Image src="/next.svg" fill alt="Logo" className="lg:p-5 p-2" />
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
          <TextInput
            type="text"
            placeholder="Search here"
            className="hidden xl:block"
            w={200}
          />
          <ActionIcon variant="light" size={"xl"} className="rounded-xl">
            <IconBell color={theme.primaryColor} size={24} />
          </ActionIcon>
          <Menu width={200}>
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
                onClick={
                  () => {
                    supabase.auth.signOut();
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
