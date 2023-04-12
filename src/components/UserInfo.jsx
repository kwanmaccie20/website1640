import { useUserProfile } from "@/hooks/userProfile";
import { Alert, Center, Group, Loader, Stack, Text } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import React from "react";

export default function UserInfo() {
  const user = useUser();
  const { profile, isLoading, error } = useUserProfile(user?.id);
  if (error) {
    console.log(error);
    return (
      <Alert title="An error occurs" color="red">
        Could not load your profile. Please try again
      </Alert>
    );
  }
  if (isLoading)
    return (
      <Center>
        <Loader />
      </Center>
    );
  if (profile) {
    console.log(profile);
    return (
      <Stack px="md">
        <Group position="apart">
          <Text>First name:</Text>
          <Text color="dimmed">{profile.first_name}</Text>
        </Group>
        <Group position="apart">
          <Text>Last name:</Text>
          <Text color="dimmed">{profile.last_name}</Text>
        </Group>
        <Group position="apart">
          <Text>Email:</Text>
          <Text color="dimmed">{profile.email}</Text>
        </Group>
        <Group position="apart">
          <Text>Phone:</Text>
          <Text color="dimmed">{profile.phone}</Text>
        </Group>
        <Group position="apart">
          <Text>Gender:</Text>
          <Text color="dimmed">{profile.gender}</Text>
        </Group>
        <Group position="apart">
          <Text>Address:</Text>
          <Text color="dimmed">{profile.address}</Text>
        </Group>
        <Group position="apart">
          <Text>Department:</Text>
          <Text color="dimmed">
            {profile.departments?.name || "Not in a department"}
          </Text>
        </Group>
      </Stack>
    );
  }
}
