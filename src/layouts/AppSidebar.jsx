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
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

export default function AppSidebar({ navOpened, role }) {
  const theme = useMantineTheme();
  const router = useRouter();
  const { toggleColorScheme } = useMantineColorScheme();
  if (role === "qa_manager")
    return (
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Navbar
          width={{ base: 80, lg: navOpened ? 288 : 80 }}
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
            <ScrollArea>
              <Stack>
                {navOpened ? (
                  <Fragment>
                    {headerLinks.qaManager.map((l, i) => (
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
                    <NavLink
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
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    {headerLinks.qaManager.map((l, i) => (
                      <Tooltip.Floating label={l.label} key={i}>
                        <NavLink
                          component={Link}
                          href={l.href}
                          active={router.pathname == l.href}
                          variant="filled"
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
                    <Tooltip.Floating label="Display">
                      <NavLink
                        variant="filled"
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
                        onClick={() => toggleColorScheme()}
                        label={
                          <Center>
                            {theme.colorScheme == "dark" ? (
                              <IconSun strokeWidth={1.5} />
                            ) : (
                              <IconMoonStars strokeWidth={1.5} />
                            )}
                          </Center>
                        }
                      />
                    </Tooltip.Floating>
                  </Fragment>
                )}
              </Stack>
            </ScrollArea>
          </MediaQuery>
          <MediaQuery largerThan={"lg"} styles={{ display: "none" }}>
            <ScrollArea scrollbarSize={2}>
              <Stack>
                {headerLinks.qaManager.map((l, i) => (
                  <Tooltip.Floating label={l.label} key={i}>
                    <NavLink
                      component={Link}
                      href={l.href}
                      active={router.pathname == l.href}
                      variant="filled"
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
                <Tooltip.Floating label="Display">
                  <NavLink
                    variant="filled"
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
                    onClick={() => toggleColorScheme()}
                    label={
                      <Center>
                        {theme.colorScheme == "dark" ? (
                          <IconSun strokeWidth={1.5} />
                        ) : (
                          <IconMoonStars strokeWidth={1.5} />
                        )}
                      </Center>
                    }
                  />
                </Tooltip.Floating>
              </Stack>
            </ScrollArea>
          </MediaQuery>
        </Navbar>
      </MediaQuery>
    );
  else if (role)
    return (
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Navbar
          width={{ base: 80, lg: navOpened ? 288 : 80 }}
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
            <ScrollArea>
              <Stack>
                {navOpened ? (
                  <Fragment>
                    {headerLinks.staff.map((l, i) => (
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
                    <NavLink
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
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    {headerLinks.staff.map((l, i) => (
                      <Tooltip.Floating label={l.label} key={i}>
                        <NavLink
                          component={Link}
                          href={l.href}
                          active={router.pathname == l.href}
                          variant="filled"
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
                    <Tooltip.Floating label="Display">
                      <NavLink
                        variant="filled"
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
                        onClick={() => toggleColorScheme()}
                        label={
                          <Center>
                            {theme.colorScheme == "dark" ? (
                              <IconSun strokeWidth={1.5} />
                            ) : (
                              <IconMoonStars strokeWidth={1.5} />
                            )}
                          </Center>
                        }
                      />
                    </Tooltip.Floating>
                  </Fragment>
                )}
              </Stack>
            </ScrollArea>
          </MediaQuery>
          <MediaQuery largerThan={"lg"} styles={{ display: "none" }}>
            <ScrollArea scrollbarSize={2}>
              <Stack>
                {headerLinks.staff.map((l, i) => (
                  <Tooltip.Floating label={l.label} key={i}>
                    <NavLink
                      component={Link}
                      href={l.href}
                      active={router.pathname == l.href}
                      variant="filled"
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
                <Tooltip.Floating label="Display">
                  <NavLink
                    variant="filled"
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
                    onClick={() => toggleColorScheme()}
                    label={
                      <Center>
                        {theme.colorScheme == "dark" ? (
                          <IconSun strokeWidth={1.5} />
                        ) : (
                          <IconMoonStars strokeWidth={1.5} />
                        )}
                      </Center>
                    }
                  />
                </Tooltip.Floating>
              </Stack>
            </ScrollArea>
          </MediaQuery>
        </Navbar>
      </MediaQuery>
    );
}
