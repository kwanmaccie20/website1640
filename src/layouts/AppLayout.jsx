import {
  Affix,
  AppShell,
  Button,
  Container,
  Drawer,
  MediaQuery,
  NavLink,
  Stack,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }) {
  const [drawerOpened, { close: closeDrawer, toggle: toggleDrawer }] =
    useDisclosure(false);
  const [navOpened, { close: closeNav, toggle: toggleNav }] =
    useDisclosure(false);
  const { toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  return (
    <>
      <AppShell
        header={
          <AppHeader
            toggleDrawer={toggleDrawer}
            toggleNav={toggleNav}
            navOpened={navOpened}
            title={children.props.title}
          />
        }
        navbar={<AppSidebar navOpened={navOpened} />}
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
          title="Logo"
          size="288px"
        >
          <Stack>
            {Array(20)
              .fill(1)
              .map((l, i) => (
                <NavLink key={i} label="Nav Link" />
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
