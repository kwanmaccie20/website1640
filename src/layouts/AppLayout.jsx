import { headerLinks } from "@/constants/headerLinks";
import {
  AppShell,
  Box,
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
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }) {
  const [drawerOpened, { close: closeDrawer, toggle: toggleDrawer }] =
    useDisclosure(false);
  const [navOpened, { close: closeNav, toggle: toggleNav }] =
    useDisclosure(false);
  const theme = useMantineTheme();
  const { toggleColorScheme } = useMantineColorScheme();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [name, setName] = useState("");
  const [role, setRole] = useState();
  const router = useRouter();
  useEffect(() => {
    const getRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/auth");
      const { data, error } = await supabase
        .from("staff")
        .select("first_name,roles(title)")
        .eq("id", session.user.id)
        .single();
      if (data) {
        setRole(data.roles.title);
        setName(data.first_name);
      }
    };
    getRole();
  }, [router, supabase]);

  useEffect(() => {
    closeDrawer();
  }, [router.pathname]);

  if (user)
    return (
      <>
        <Head>
          <title>{children.props.title}</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/Logo.svg" />
        </Head>
        <AppShell
          header={
            <AppHeader
              toggleDrawer={toggleDrawer}
              toggleNav={toggleNav}
              navOpened={navOpened}
              title={children.props.title}
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
          padding={0}
        >
          <Container size="xl" px={"sm"} py={"md"}>
            {children}
          </Container>
        </AppShell>

        {/* drawer */}
        <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
          <Drawer
            opened={drawerOpened}
            onClose={closeDrawer}
            title={
              <Box
                className={` relative flex justify-center items-center w-52 h-20`}
              >
                {/* logo here */}
                <Image src="/Logo.svg" fill alt="Logo" className="lg:p-5 p-2" />
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
                      active={router.pathname == l.href}
                      variant="filled"
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
                      active={router.pathname == l.href}
                      variant="filled"
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
              {/* <NavLink
                py="md"
                px={"xl"}
                label={<Text size={"md"}>Display</Text>}
                className="transition-all"
                onClick={() => toggleColorScheme()}
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
                icon={
                  theme.colorScheme == "dark" ? (
                    <IconSun strokeWidth={1.5} />
                  ) : (
                    <IconMoonStars strokeWidth={1.5} />
                  )
                }
              /> */}
            </Stack>
          </Drawer>
        </MediaQuery>
      </>
    );
}
