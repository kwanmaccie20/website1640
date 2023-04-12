import React from "react";
import AppLayout from "@/layouts/AppLayout";
import {
  ScrollArea,
  Table,
  Group,
  Avatar,
  Badge,
  Anchor,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUserProfile } from "@/hooks/userProfile";
import { useUser } from "@supabase/auth-helpers-react";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import UserInfo from "@/components/UserInfo";
export default function Department() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { profile, isLoading, mutate } = useUserProfile(user?.id);
  const [listStaff, setListStaff] = useState([]);
  const singleRow = {
    avatar:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    name: "Robert Wolfkisser",
    job: "Engineer",
    email: "rob_wolf@gmail.com",
    phone: "+44 (452) 886 09 12",
  };
  const getData = async () => {
    if (profile) {
      const { data, error } = await supabase
        .from("staff")
        .select("*, departments!staff_department_id_fkey!inner(*)")
        .eq("departments.id", profile?.departments?.id);
      //                     src={`https://i.pravatar.cc/150?u=${user.email}`}
      try {
        const matchFormat = data.map((val) => ({
          avatar: `https://i.pravatar.cc/150?u=${val.email}`,
          name: val.first_name + " " + val.last_name,
          job: val.gender,
          email: val.email,
          phone: val.phone,
          id: val.id,
        }));
        setListStaff(matchFormat);
      } catch {
        notifications.show({
          title: "Error to get data",
          color: "red",
          icon: <IconX />,
        });
      }
    }
  };
  useEffect(() => {
    getData();
  }, [profile]);
  const rows = listStaff.map((item) => (
    <tr key={item.name}>
      <td>
        <Group spacing="sm">
          <Avatar size={30} src={item.avatar} radius={30} />
          <Anchor
            fz="sm"
            fw={500}
            onClick={() =>
              modals.open({
                title: <b>{item.name}&apos;s profile</b>,
                children: <UserInfo userId={item.id} />,
              })
            }
          >
            {item.name}
          </Anchor>
        </Group>
      </td>

      <td>
        <Badge variant={"light"}>{item.job}</Badge>
      </td>
      <td>
        <Anchor size="sm" href={`mailto:${item.email}`}>
          {item.email}
        </Anchor>
      </td>
      <td>
        <Text fz="sm" c="dimmed">
          {item.phone}
        </Text>
      </td>
    </tr>
  ));
  return (
    <div>
      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}

Department.getLayout = (Page) => <AppLayout>{Page}</AppLayout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Department",
    },
  };
}
