import { headerLinks } from "@/constants/headerLinks";
import {
  Affix,
  AppShell,
  Box,
  Button,
  Container,
  Drawer,
  MediaQuery,
  NavLink,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }) {
  const [drawerOpened, { close: closeDrawer, toggle: toggleDrawer }] =
    useDisclosure(false);
  const [navOpened, { close: closeNav, toggle: toggleNav }] =
    useDisclosure(false);
  const { toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [name, setName] = useState("");
  const [role, setRole] = useState();
  const router = useRouter();
  useEffect(() => {
    const getRole = async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("first_name,roles(title)")
        .eq("id", user?.id)
        .single();
      if (data) {
        setRole(data.roles.title);
        setName(data.first_name);
      }
    };
    if (user) {
      getRole();
    }
  }, [router, supabase, user]);
  if (user)
    return (
      <>
        <AppShell
          header={
            <AppHeader
              toggleDrawer={toggleDrawer}
              toggleNav={toggleNav}
              navOpened={navOpened}
              title={children.props.title}
              user={user}
              name={name}
            />
          }
          navbar={<AppSidebar navOpened={navOpened} role={role} />}
          navbarOffsetBreakpoint="md"
          styles={{
            main: {
              transition: "ease",
              transitionDuration: "300ms",
              transitionProperty: "padding",
            },
          }}
        >
          <Container size="xl">{children}</Container>
        </AppShell>

        {/* drawer */}
        <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
          <Drawer
            opened={drawerOpened}
            onClose={closeDrawer}
            title={
              <Box
                style={{
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[2],
                }}
                className={` relative flex justify-center items-center w-52 h-20`}
              >
                {/* logo here */}
                <Image src="/next.svg" fill alt="Logo" className="lg:p-5 p-2" />
              </Box>
            }
            size="288px"
          >
            <Stack>
              {role == "qa_manager"
                ? headerLinks.qaManager.map((l, i) => (
                    <NavLink
                      component={Link}
                      href={l.href}
                      py="md"
                      px={"xl"}
                      key={i}
                      label={<Text size={"md"}>{l.label}</Text>}
                      className="transition-all"
                      styles={(theme) => ({
                        root: {
                          "&:hover": {
                            background: theme.fn.gradient({
                              from: "transparent",
                              to: theme.fn.rgba(theme.fn.primaryColor(), 0.5),
                              deg: 45,
                            }),
                            borderRight: `7px solid ${theme.fn.primaryColor()}`,
                            borderRadius: "0 3px 3px 0",
                          },
                        },
                      })}
                      icon={<l.icon strokeWidth={1.5} />}
                    />
                  ))
                : headerLinks.staff.map((l, i) => (
                    <NavLink
                      component={Link}
                      href={l.href}
                      py="md"
                      px={"xl"}
                      key={i}
                      label={<Text size={"md"}>{l.label}</Text>}
                      className="transition-all"
                      styles={(theme) => ({
                        root: {
                          "&:hover": {
                            background: theme.fn.gradient({
                              from: "transparent",
                              to: theme.fn.rgba(theme.fn.primaryColor(), 0.5),
                              deg: 45,
                            }),
                            borderRight: `7px solid ${theme.fn.primaryColor()}`,
                            borderRadius: "0 3px 3px 0",
                          },
                        },
                      })}
                      icon={<l.icon strokeWidth={1.5} />}
                    />
                  ))}
            </Stack>
          </Drawer>
        </MediaQuery>

        <Affix>
          <Button onClick={() => toggleColorScheme()}>Toggle scheme</Button>
        </Affix>
      </>
    );
}
