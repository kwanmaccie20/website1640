import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeModal, modals } from "@mantine/modals";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
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

  const handleDeleteRow = (row) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">Are you sure to delete {row.getValue("name")}?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      onCancel: () => modals.closeAll(),
      onConfirm: async () => {
        const { error, data } = await supabase
          .from("departments")
          .delete()
          .eq("id", row.original.id)
          .select("id")
          .single();
        if (data) {
          modals.closeAll();
          mutate();
        }
        if (error) {
          console.log("delDept", error);
          window.alert("Error occurs when delete");
        }
      },
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
        header: "Coordinator Email",
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
      throw new Error(error.message);
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
        throw new Error(stErr.message);
      }
      if (st) {
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
      throw new Error(error.message);
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
        throw new Error(stErr?.message + "\n" + ostErr?.message);
      }
      if (st && ost) {
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

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Department Management",
    },
  };
}
