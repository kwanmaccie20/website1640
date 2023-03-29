import { headerLinks } from "@/constants/headerLinks";
import {
  Center,
  MediaQuery,
  Navbar,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AppSidebar({ navOpened, role }) {
  const theme = useMantineTheme();
  if (role === "qa_manager")
    return (
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Navbar
          width={{ base: 80, lg: navOpened ? 288 : 80 }}
          height={"100%"}
          hiddenBreakpoint="md"
          hidden={!navOpened}
          style={{
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[2],
            border: "none",
          }}
          className="transition-[width] ease duration-300 py-3"
        >
          <MediaQuery smallerThan={"lg"} styles={{ display: "none" }}>
            <ScrollArea scrollbarSize={2}>
              <Stack>
                {navOpened
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
                  : headerLinks.qaManager.map((l, i) => (
                      <Tooltip.Floating label={l.label} key={i}>
                        <NavLink
                          component={Link}
                          href={l.href}
                          styles={(theme) => ({
                            root: {
                              "&:hover": {
                                background: theme.fn.gradient({
                                  from: "transparent",
                                  to: theme.fn.rgba(
                                    theme.fn.primaryColor(),
                                    0.5
                                  ),
                                  deg: 45,
                                }),
                              },
                            },
                          })}
                          className="rounded-md"
                          py="md"
                          label={
                            <Center>
                              <l.icon strokeWidth={1.5} />
                            </Center>
                          }
                        />
                      </Tooltip.Floating>
                    ))}
              </Stack>
            </ScrollArea>
          </MediaQuery>
          <MediaQuery largerThan={"lg"} styles={{ display: "none" }}>
            <ScrollArea>
              <Stack>
                {headerLinks.qaManager.map((l, i) => (
                  <Tooltip.Floating label={l.label} key={i}>
                    <NavLink
                      component={Link}
                      href={l.href}
                      styles={(theme) => ({
                        root: {
                          "&:hover": {
                            background: theme.fn.gradient({
                              from: "transparent",
                              to: theme.fn.rgba(theme.fn.primaryColor(), 0.5),
                              deg: 45,
                            }),
                          },
                        },
                      })}
                      className="rounded-md"
                      py="md"
                      label={
                        <Center>
                          <l.icon strokeWidth={1.5} />
                        </Center>
                      }
                    />
                  </Tooltip.Floating>
                ))}
              </Stack>
            </ScrollArea>
          </MediaQuery>
        </Navbar>
      </MediaQuery>
    );
  else
    return (
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Navbar
          width={{ base: 80, lg: navOpened ? 288 : 80 }}
          height={"100%"}
          hiddenBreakpoint="md"
          hidden={!navOpened}
          style={{
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[2],
            border: "none",
          }}
          className="transition-[width] ease duration-300 py-3"
        >
          <MediaQuery smallerThan={"lg"} styles={{ display: "none" }}>
            <ScrollArea scrollbarSize={2}>
              <Stack>
                {navOpened
                  ? headerLinks.staff.map((l, i) => (
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
                      <Tooltip.Floating label={l.label} key={i}>
                        <NavLink
                          component={Link}
                          href={l.href}
                          styles={(theme) => ({
                            root: {
                              "&:hover": {
                                background: theme.fn.gradient({
                                  from: "transparent",
                                  to: theme.fn.rgba(
                                    theme.fn.primaryColor(),
                                    0.5
                                  ),
                                  deg: 45,
                                }),
                              },
                            },
                          })}
                          className="rounded-md"
                          py="md"
                          label={
                            <Center>
                              <l.icon strokeWidth={1.5} />
                            </Center>
                          }
                        />
                      </Tooltip.Floating>
                    ))}
              </Stack>
            </ScrollArea>
          </MediaQuery>
          <MediaQuery largerThan={"lg"} styles={{ display: "none" }}>
            <ScrollArea>
              <Stack>
                {headerLinks.staff.map((l, i) => (
                  <Tooltip.Floating label={l.label} key={i}>
                    <NavLink
                      component={Link}
                      href={l.href}
                      styles={(theme) => ({
                        root: {
                          "&:hover": {
                            background: theme.fn.gradient({
                              from: "transparent",
                              to: theme.fn.rgba(theme.fn.primaryColor(), 0.5),
                              deg: 45,
                            }),
                          },
                        },
                      })}
                      className="rounded-md"
                      py="md"
                      label={
                        <Center>
                          <l.icon strokeWidth={1.5} />
                        </Center>
                      }
                    />
                  </Tooltip.Floating>
                ))}
              </Stack>
            </ScrollArea>
          </MediaQuery>
        </Navbar>
      </MediaQuery>
    );
}
