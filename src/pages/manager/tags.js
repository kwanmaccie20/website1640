import AppLayout from "@/layouts/AppLayout";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  IconCheck,
  IconEdit,
  IconLock,
  IconQuestionCircle,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { MantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";

// id name 2 closure, aca id

export default function Tags() {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const {
    data: tableData,
    isLoading,
    isValidating,
    mutate,
    error,
  } = useSWR("tags", async () => {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      notifications.show({
        title: "An error occurred",
        message: error.message,
        icon: <IconX />,
        color: "red",
      });
    }
    return data;
  });
  useEffect(() => {}, [tableData]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  //Ok-Edit
  const handleCreateNewRow = async (values) => {
    const { data, error } = await supabase
      .from("tags")
      .insert({
        name: values.name,
      })
      .select("*");
    if (error) {
      mutate([...tableData, data]);
      notifications.show({
        title: "The tag has been added failed.",
        message: "",
        icon: <IconX />,
        color: "red",
      });
    }
    if (data) {
      mutate([...tableData, data]);
      notifications.show({
        title: "The tag has been added successfully",
        message: "",
        icon: <IconCheck />,
      });
    }
  };

  // const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
  //   if (!Object.keys(validationErrors).length) {
  //     const { error } = await supabase
  //       .from("academic_year")
  //       .update({
  //         name: values.name,
  //         closure_date: values.closure_date,
  //         final_closure_date: values.final_closure_date,
  //         academic_id: values.academic_id,
  //       })
  //       .eq("id", row.original.id);
  //     if (error) {
  //       window.alert("An error occurs when update");
  //     } else {
  //       tableData[row.index] = values;
  //       mutate(tableData);
  //     }
  //     //send/receive api updates here, then refetch or update local table data for re-render
  //     exitEditingMode(); //required to exit editing mode and close modal
  //   }
  // };
  const handleUpdateRow = (table, row) => {
    modals.open({
      title: "Update the campaign",
      children: <UpdateExistCampaignModal table={table} row={row} />,
      modalId: "THIS2010",
    });
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  //Ok-Edit
  const handleDeleteRow = (row) => {
    modals.openConfirmModal({
      title: "Close Campaign Now?",
      children: (
        <Text size="sm">
          Are you sure to delete this tag{" "}
          <strong>{row.getValue("name")}</strong>?
        </Text>
      ),
      labels: { confirm: "Continue", cancel: "Cancel" },
      onCancel: () => modals.closeAll(),
      onConfirm: async () => {
        const { data: checkIdeaTag, error: checkIdeaError } = await supabase
          .from("ideas")
          .select("*", { count: "exact" })
          .eq("tag_id", row.original.id);
        if (checkIdeaError) {
          notifications.show({
            title: "Error occurs when delete the tag.",
            message: "",
            icon: <IconX />,
            color: "red",
          });
          return;
        }
        if (checkIdeaTag.length > 0) {
          notifications.show({
            title:
              "This tag has being used. Please remove all idea before delete this tag.",
            message:
              "This tag has being used. Please remove all idea before delete this tag.",
            icon: <IconX />,
            color: "red",
          });
        } else {
          const { error, data } = await supabase
            .from("tags")
            .delete()
            .eq("id", row.original.id)
            .select("id")
            .single();
          if (data) {
            notifications.show({
              title: "The tag has been deleted.",
              message: "",
              icon: <IconCheck />,
            });
            modals.closeAll();
            mutate();
          }
          if (error) {
            notifications.show({
              title: "Error occurs when close the tag.",
              message: "",
              icon: <IconX />,
              color: "red",
            });
          }
        }
      },
    });
  };
  //OK-Edit
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Tag name",
        Cell: ({ cell }) => {
          return <>{cell.getValue("name")}</>;
        },
      },
    ],
    []
  );

  return (
    <>
      <MantineReactTable
        columns={columns}
        data={tableData ?? []}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        enableDensityToggle={false}
        // onEditingRowSave={handleSaveRowEdits}
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
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="Edit">
              <ActionIcon onClick={() => handleUpdateRow(table, row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="right" label="Close Campaign">
              <ActionIcon color="red" onClick={() => handleDeleteRow(row)}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color={theme.fn.primaryColor()}
            onClick={() => setCreateModalOpen(true)}
            variant="filled"
          >
            + New
          </Button>
        )}
      />
      <CreateNewModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
}

//example of creating a mantine dialog modal for creating new rows
export const CreateNewModal = ({ open, columns, onClose, onSubmit }) => {
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (val) => (val.length > 0 ? null : "Blank name?"),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  });

  return (
    <Modal
      keepMounted={false}
      opened={open}
      onClose={() => {
        onClose();
        form.reset();
      }}
      title="Add New Tag"
    >
      <form onSubmit={handleSubmit}>
        <Stack
          sx={{
            width: "100%",
          }}
        >
          <TextInput
            label="Name"
            required
            {...form.getInputProps("name")}
            placeholder="Type tag name"
          />
        </Stack>
        <Group position="right" mt={"lg"}>
          <Button
            onClick={() => {
              onClose();
              form.reset();
            }}
            variant="subtle"
          >
            Cancel
          </Button>
          <Button color="teal" type="submit" variant="filled">
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
//Ok-Edit
export const UpdateExistCampaignModal = ({ table, row }) => {
  const supabase = useSupabaseClient();
  const form = useForm({
    initialValues: {
      name: row.original.name,
    },
    validate: {
      name: (val) => (val.length > 0 ? null : "Blank name?"),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await supabase
      .from("tags")
      .update({
        name: values.name,
      })
      .select("id")
      .eq("id", row.original.id);
    if (data) {
      notifications.show({
        title: "The tag has been updated successfully",
        message: "",
        icon: <IconCheck />,
      });
      mutate("tags");
      modals.close("THIS2010");
      form.reset();
    }
    if (error) {
      notifications.show({
        title: "Could not update the tag.",
        message: "",
        icon: <IconX />,
        color: "red",
      });
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <TextInput
          label="Name"
          required
          {...form.getInputProps("name")}
          placeholder="Type tag name"
        />
      </Stack>
      <Group position="right" mt={"lg"}>
        <Button
          onClick={() => {
            modals.close("THIS2010");
            form.reset();
          }}
          variant="subtle"
        >
          Cancel
        </Button>
        <Button color="teal" type="submit" variant="filled">
          Update
        </Button>
      </Group>
    </form>
  );
};

Tags.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Tags Management",
    },
  };
}
