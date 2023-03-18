import {
  AppShell,
  Container,
  Drawer,
  MediaQuery,
  NavLink,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

export default function AppLayout(props) {
  const { children, ...rest } = props;
  const [drawerOpened, { close: closeDrawer, toggle: toggleDrawer }] =
    useDisclosure(false);
  const [navOpened, { close: closeNav, toggle: toggleNav }] =
    useDisclosure(false);
  return (
    <>
      <AppShell
        header={
          <AppHeader
            toggleDrawer={toggleDrawer}
            toggleNav={toggleNav}
            navOpened={navOpened}
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
        <Container>{children}</Container>
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
    </>
  );
}
