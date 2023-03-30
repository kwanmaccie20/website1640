import AppLayout from "@/layouts/AppLayout";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  MultiSelect,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  IconCheck,
  IconEdit,
  IconTrash,
  IconUserMinus,
  IconUserPlus,
  IconX,
} from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export default function Department() {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const {
    data: tableData,
    isLoading,
    isValidating,
    mutate,
    error,
  } = useSWR("department", async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("*, staff!departments_coordinator_id_fkey(email,id)")
      .order("id", { ascending: true });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    return data;
  });

  const handleCreateNew = () => {
    modals.open({
      title: "Create New Department",
      children: <CreateNewModal mutate={mutate} />,
    });
  };

  const handleUpdateRow = (row) => {
    modals.open({
      title: "Update Department",
      children: <UpdateModal mutate={mutate} row={row} />,
    });
  };

  const handleDeleteRow = async (row) => {
    const { count } = await supabase
      .from("staff")
      .select("id", { count: "exact" })
      .eq("department_id", row.original.id);
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <>
          <Text size="sm">Are you sure to delete {row.getValue("name")}?</Text>
          <Text size="sm">
            A staff of {count} will be removed from this department.
          </Text>
        </>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => modals.closeAll(),
      onConfirm: async () => {
        const { error, data } = await supabase
          .from("departments")
          .delete()
          .eq("id", row.original.id)
          .select("coordinator_id")
          .single();
        if (data) {
          const { error } = await supabase
            .from("staff")
            .update("role_id", 4)
            .eq("id", data.coordinator_id);
          if (error) {
            notifications.show({
              title: "An error occurs",
              message: `Could not delete department information`,
              icon: <IconX />,
              color: "red",
            });
          } else {
            modals.closeAll();
            mutate();
            notifications.show({
              title: "Department deleted successfully",
              icon: <IconCheck />,
            });
          }
        }
        if (error) {
          console.log("delDept", error);
          window.alert("Error occurs when delete");
        }
      },
    });
  };

  const handleAddMembers = async (row) => {
    modals.open({
      title: "Add members",
      children: <AddNewMembers row={row} mutate={mutate} />,
      size: "lg",
    });
  };

  const handleRemoveMembers = async (row) => {
    modals.open({
      title: "Remove members",
      children: <RemoveMembers row={row} mutate={mutate} />,
      size: "lg",
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Department Name",
      },
      {
        accessorKey: "staff.email",
        header: "Coordinator",
      },
    ],
    []
  );

  return (
    <>
      <MantineReactTable
        columns={columns}
        data={tableData ?? []}
        enableColumnOrdering
        enableEditing
        enableDensityToggle={false}
        mantineToolbarAlertBannerProps={
          error
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        state={{
          isLoading: isLoading,
          showAlertBanner: error,
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="Edit">
              <ActionIcon onClick={() => handleUpdateRow(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Delete">
              <ActionIcon color="red" onClick={() => handleDeleteRow(row)}>
                <IconTrash />{" "}
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Add member">
              <ActionIcon onClick={() => handleAddMembers(row)}>
                <IconUserPlus />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Remove member">
              <ActionIcon onClick={() => handleRemoveMembers(row)}>
                <IconUserMinus />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color={theme.fn.primaryColor()}
            onClick={handleCreateNew}
            variant="filled"
          >
            + New
          </Button>
        )}
      />
    </>
  );
}

function CreateNewModal({ mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const [staff, setStaff] = useState([]);
  const form = useForm({
    initialValues: {
      name: "",
      coordinator_id: "",
    },
  });
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("id, email")
        .neq("role_id", 2)
        .is("department_id", null);
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) setStaff(data);
    })();
  }, [supabase]);

  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("departments")
      .insert({
        name: values.name,
        coordinator_id: values.coordinator_id,
      })
      .select("id, coordinator_id")
      .single();
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: `Could not add department information`,
        icon: <IconX />,
        color: "red",
      });
    }
    if (data) {
      const { data: st, error: stErr } = await supabase
        .from("staff")
        .update({
          department_id: data.id,
          role_id: 3,
        })
        .eq("id", data.coordinator_id)
        .select("id")
        .single();
      if (stErr) {
        console.log(stErr);
        notifications.show({
          title: "An error occurs",
          message: `Could not add department information`,
          icon: <IconX />,
          color: "red",
        });
      }
      if (st) {
        notifications.show({
          title: "Department added successfully",
          icon: <IconCheck />,
        });
        modals.closeAll();
        mutate();
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Department Name"
          placeholder="Type department name"
          required
          {...form.getInputProps("name")}
        />
        <Select
          label="Coordinator"
          placeholder="Select coordinator"
          required
          withinPortal
          data={staff?.map((s) => ({ label: s.email, value: s.id })) || []}
          {...form.getInputProps("coordinator_id")}
        />
        <Group position="right">
          <Button variant="light" onClick={modals.closeAll}>
            Cancel
          </Button>
          <Button color={theme.fn.primaryColor()} type="submit">
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function UpdateModal({ mutate, row }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const [staff, setStaff] = useState([]);
  const form = useForm({
    initialValues: {
      name: row.original.name,
      coordinator_id: row.original.coordinator_id,
    },
  });
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("id, email")
        .neq("role_id", 2)
        .or(`department_id.is.null,department_id.eq.${row.original.id}`);
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) {
        setStaff(data);
        console.log(data);
      }
    })();
  }, [row.original.id, supabase]);

  const handleSubmit = form.onSubmit(async (values) => {
    const oldCoordinator = row.original.coordinator_id;
    const { data, error } = await supabase
      .from("departments")
      .update({
        name: values.name,
        coordinator_id: values.coordinator_id,
      })
      .eq("id", row.original.id)
      .select("id, coordinator_id")
      .single();
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: `Could not update department information`,
        icon: <IconX />,
        color: "red",
      });
    }
    if (data) {
      const { data: st, error: stErr } = await supabase
        .from("staff")
        .update({
          department_id: data.id,
          role_id: 3,
        })
        .eq("id", data.coordinator_id)
        .select("id")
        .single();
      const { data: ost, error: ostErr } = await supabase
        .from("staff")
        .update({
          role_id: 4,
        })
        .eq("id", oldCoordinator)
        .select("id")
        .single();
      if (stErr || ostErr) {
        console.log(stErr, ostErr);
        notifications.show({
          title: "An error occurs",
          message: `Could not update department information`,
          icon: <IconX />,
          color: "red",
        });
      }
      if (st && ost) {
        notifications.show({
          title: "Department information updated successfully",
          icon: <IconCheck />,
        });
        modals.closeAll();
        mutate();
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack pt="xl">
        <TextInput
          label="Department Name"
          placeholder="Type department name"
          required
          {...form.getInputProps("name")}
        />
        <Select
          label="Coordinator"
          placeholder="Select coordinator"
          required
          data={staff?.map((s) => ({ label: s.email, value: s.id })) || []}
          {...form.getInputProps("coordinator_id")}
        />
        <Group position="right">
          <Button variant="light" onClick={modals.closeAll}>
            Cancel
          </Button>
          <Button color={theme.fn.primaryColor()} type="submit">
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function AddNewMembers({ row, mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const [freeStaff, setFreeStaff] = useState([]);
  const form = useForm({
    initialValues: {
      members: [],
    },
  });
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("id, email")
        .is("department_id", null)
        .neq("role_id", 2);
      if (error) {
        console.log(error);
        throw new Error(error);
      }
      if (data) {
        setFreeStaff(data);
      }
    })();
  }, [supabase]);
  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("staff")
      .update({ department_id: row.original.id })
      .in("id", values.members)
      .select("id");
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: `Could not add members`,
        icon: <IconX />,
        color: "red",
      });
    }
    if (data) {
      notifications.show({
        title: "Member added successfully",
        message: `${values.members.length} member${
          values.members.length == 1 ? " has" : "s have"
        } been added`,
        icon: <IconCheck />,
      });
      mutate();
      modals.closeAll();
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <MultiSelect
          data={freeStaff.map((s) => ({ label: s.email, value: s.id }))}
          clearable
          label="Select member"
          searchable
          required
          withinPortal
          {...form.getInputProps("members")}
        />
        <Group position="right">
          <Button variant="light" onClick={modals.closeAll}>
            Cancel
          </Button>
          <Button
            color={theme.fn.primaryColor()}
            type="submit"
            disabled={form.values.members.length == 0}
          >
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function RemoveMembers({ row, mutate }) {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const [member, setMember] = useState([]);
  const form = useForm({
    initialValues: {
      currentMember: member,
    },
  });
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("id, email")
        .eq("department_id", row.original.id);
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) {
        setMember(data.filter((m) => m.id !== row.original.coordinator_id));
      }
    })();
  }, [row.original.coordinator_id, row.original.id, supabase]);

  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("staff")
      .update({ department_id: null })
      .in("id", values.currentMember)
      .select("id");
    if (error) {
      console.log(error);
      notifications.show({
        title: "An error occurs",
        message: `Could not remove members`,
        icon: <IconX />,
        color: "red",
      });
    }
    if (data) {
      notifications.show({
        title: "Member removed successfully",
        message: `${values.currentMember.length} member${
          values.currentMember.length == 1 ? " has" : "s have"
        } been removed`,
        icon: <IconCheck />,
      });
      mutate();
      modals.closeAll();
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <MultiSelect
          data={member.map((s) => ({ label: s.email, value: s.id }))}
          clearable
          label="Select member to remove"
          searchable
          required
          withinPortal
          {...form.getInputProps("currentMember")}
        />
        <Group position="right">
          <Button variant="light" onClick={modals.closeAll}>
            Cancel
          </Button>
          <Button color="red" type="submit" disabled={!form.isDirty()}>
            Remove
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

Department.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Department Management",
    },
  };
}
