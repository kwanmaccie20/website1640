import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
} from "@tabler/icons-react";
import React from "react";

export default function IdeaCard({ idea }) {
  const theme = useMantineTheme();
  return (
    <Card shadow="sm" py="sm" radius="md">
      <Group position="apart" align="flex-start">
        <Stack spacing={0}>
          <Anchor>
            <Text className="font-medium">{idea.author}</Text>
          </Anchor>
          <Text size="sm" color="dimmed">
            {idea.department}
          </Text>
        </Stack>
        <Badge size="lg">{idea.campaign}</Badge>
      </Group>
      <Text my="md" size="md">
        {idea.content}
      </Text>
      <Group position="apart" mb="xs">
        <Group spacing={0}>
          <ActionIcon className="bg-transparent" color={theme.primaryColor}>
            <IconThumbUpFilled strokeWidth={1.5} />
          </ActionIcon>
          <Text>{idea.likes}</Text>
        </Group>
        <Group>
          <Text color="dimmed" size="sm">
            Close: {idea.closureDate}
          </Text>
          <Text color="dimmed" size="sm">
            {idea.comments.length}{" "}
            {idea.comments.length > 1 ? "comments" : "comment"}
          </Text>
        </Group>
      </Group>
      <Divider />
      <Group grow py={3}>
        <ActionIcon size="lg">
          <IconThumbUp strokeWidth={1.5} />
        </ActionIcon>
        <ActionIcon size="lg">
          <IconThumbDown strokeWidth={1.5} />
        </ActionIcon>
      </Group>
      <Divider />

      {idea.comments.map((comment, index) => (
        <Card withBorder shadow="sm" radius="md" key={index} variant="">
          <Anchor>
            <Text className="font-medium">{comment.author}</Text>
          </Anchor>
          <Text>{comment.content}</Text>
        </Card>
      ))}
      <Box my={"sm"}>
        <form>
          <TextInput
            variant="filled"
            radius="md"
            size="md"
            placeholder="Write your comment"
          />
        </form>
      </Box>
    </Card>
  );
}

/*

{
    author: "Author 1",
    department: "Department 1",
    campaign: "Campaign 1",
    content:
      "Laborum magna quis enim cillum eiusmod. Consequat tempor ad cupidatat sit dolore cupidatat nulla culpa proident elit anim. Non incididunt anim non reprehenderit eu esse minim elit sit Lorem consequat aliquip culpa exercitation. Sit proident do magna cillum aliqua in non sint.",
    commentCount: 43,
    likes: 21,
    dislikes: 2,
    closureDate: "Jun 14th, 2023",
    createdAt: "Jun 1st, 2023",
    comments: [
      {
        author: "Author 1",
        content:
          "Lorem non consequat ut aute laboris do consectetur magna tempor minim reprehenderit eu do. Anim sint Lorem occaecat sint tempor cupidatat cillum aliqua culpa sint. Proident cillum culpa anim cillum. Ipsum exercitation dolor fugiat et adipisicing enim sint. Anim excepteur quis ad ipsum dolore esse ad. Cillum minim reprehenderit magna exercitation. Esse reprehenderit exercitation aute tempor officia aliquip enim.",
      },
    ],
  },
*/
