import { headerLinks } from "@/constants/headerLinks";
import { useCurrentUserRole } from "@/hooks/currentUser";
import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  Avatar,
  ActionIcon,
  Badge,
  Container,
  useMantineTheme,
  useMantineColorScheme,
  Stack,
  Title,
  Menu,
  MediaQuery,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconMoonStars,
  IconBell,
  IconSun,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Logo from "./Logo";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.sm,
    // margin: `0 ${rem(4)}`,
    marginRight: "5px",
    padding: `${rem(8)} ${rem(12)}`,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("md")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
    link: "/document",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme, cx } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const router = useRouter();
  const { role } = useCurrentUserRole();
  const active = router.asPath;

  const links = mockdata.map((item) => (
    <UnstyledButton
      component={Link}
      href={item?.link ?? "#"}
      className={cx(classes.subLink, {
        [classes.linkActive]: active == item?.link,
      })}
      key={item.title}
    >
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box>
      <Header height={64}>
        <Container size="lg">
          <Group position="apart" sx={{ height: "100%" }}>
            <div
              style={{
                height: "64px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Logo />
            </div>
            <Group
              sx={{ height: "100%" }}
              spacing={0}
              className={classes.hiddenMobile}
            >
              {headerLinks[role].map((link, index) => (
                <UnstyledButton
                  key={index}
                  component={Link}
                  href={link.href}
                  className={cx(classes.link, {
                    [classes.linkActive]: active == link.href,
                  })}
                >
                  {link.label}
                </UnstyledButton>
              ))}
              {/* <HoverCard
                width={600}
                position="bottom"
                radius="md"
                shadow="md"
                withinPortal
              >
                <HoverCard.Target>
                  <a href="#" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Features
                      </Box>
                      <IconChevronDown
                        size={16}
                        color={theme.fn.primaryColor()}
                      />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                  <Group position="apart" px="md">
                    <Text fw={500}>Features</Text>
                    <Anchor href="#" fz="xs">
                      View all
                    </Anchor>
                  </Group>

                  <Divider
                    my="sm"
                    mx="-md"
                    color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                  />

                  <SimpleGrid cols={2} spacing={0}>
                    {links}
                  </SimpleGrid>

                  <div className={classes.dropdownFooter}>
                    <Group position="apart">
                      <div>
                        <Text fw={500} fz="sm">
                          Get started
                        </Text>
                        <Text size="xs" color="dimmed">
                          Their food sources have decreased, and their numbers
                        </Text>
                      </div>
                      <Button variant="default">Get started</Button>
                    </Group>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard> */}
            </Group>

            <Group>
              {role == "staff" && (
                <ActionIcon variant="light" radius="xl" size="lg">
                  <IconBell strokeWidth={1.5} />{" "}
                </ActionIcon>
              )}
              <ActionIcon
                onClick={() => toggleColorScheme()}
                variant="light"
                radius="xl"
                size="lg"
              >
                {colorScheme == "light" ? (
                  <IconMoonStars strokeWidth={1.5} size={20} />
                ) : (
                  <IconSun strokeWidth={1.5} />
                )}
              </ActionIcon>
              <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
                <Menu width={300} shadow="lg" withArrow>
                  <Menu.Target>
                    <ActionIcon>
                      <Avatar radius="xl" />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item>Truong Duy Nguyen</Menu.Item>
                    <Menu.Item color={"red"}>Logout</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </MediaQuery>
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                className={classes.hiddenDesktop}
              />
            </Group>
          </Group>
        </Container>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={<Logo />}
        className={classes.hiddenDesktop}
      >
        <ScrollArea h={"100%"}>
          <Divider color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />
          {/* <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse> */}
          <UnstyledButton
            component={Link}
            href="#"
            className={cx(classes.link, {
              [classes.linkActive]: active == "#",
            })}
          >
            Truong Duy Nguyen
          </UnstyledButton>
          {headerLinks[role].map((link, index) => (
            <UnstyledButton
              key={index}
              component={Link}
              href={link.href}
              className={cx(classes.link, {
                [classes.linkActive]: active == link.href,
              })}
            >
              {link.label}
            </UnstyledButton>
          ))}
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          <UnstyledButton
            component={Link}
            href="/logout"
            className={cx(classes.link, {
              [classes.linkActive]: active == "#",
            })}
          >
            <Text color={"red"}>Logout</Text>
          </UnstyledButton>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
