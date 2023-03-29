import {
  ActionIcon,
  Box,
  Button,
  Group,
  Input,
  Modal,
  Popover,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { DateInput, DatePickerInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { closeAllModals, modals } from "@mantine/modals";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconEdit, IconQuestionCircle, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

// id name 2 closure, aca id

export default function AcademicYear() {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const {
    data: tableData,
    isLoading,
    isValidating,
    mutate,
    error,
  } = useSWR("campaigns", async () => {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*, academic_year(name)")
      .order("id", { ascending: true });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    return data;
  });
  useEffect(() => {
    console.log(tableData);
  }, [tableData]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = async (values) => {
    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        name: values.name,
        closure_date: values.closure[0],
        final_closure_date: values.closure[1],
        academic_id: values.academic_id,
      })
      .select("*");
    if (error) {
      console.log(error);
      window.alert("Error occurs during insert");
    }
    if (data) mutate([...tableData, data]);
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
  //       console.log(error);
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
          .from("campaigns")
          .delete()
          .eq("id", row.original.id)
          .select("id")
          .single();
        if (data) {
          modals.closeAll();
          mutate();
        }
        if (error) {
          console.log("deCamp", error);
          window.alert("Error occurs when delete");
        }
      },
    });
  };

  const getCommonEditTextInputProps = useCallback(
    (cell) => {
      return {
        error: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "name" && validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Campaign",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: "closure_date",
        header: "Closure Date",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
        Cell: ({ cell }) => {
          return (
            <>
              <Group>
                <div>
                  <DatePickerInput
                    dropdownType="modal"
                    variant={"unstyled"}
                    value={dayjs(cell.getValue("closure_date")).toDate()}
                    onChange={async (e) => {
                      if (
                        dayjs(e) < dayjs(cell.row.original.final_closure_date)
                      ) {
                        console.log("TRUE");

                        //CONTINUE
                        //  const { data, error } = await supabase
                        //    .from("campaigns")
                        //    .update({
                        //      closure_date: dayjs(e)
                        //        .set("hour", 0)
                        //        .set("minute", 0)
                        //        .set("second", 0)
                        //        .toDate(),
                        //    })
                        //    .eq("id", cell.row.original.id);
                      } else {
                        console.log("FALSE");
                      }
                    }}
                    icon={
                      <ActionIcon>
                        <IconEdit size={"xs"} />
                      </ActionIcon>
                    }
                  />
                </div>
              </Group>
            </>
          );
        },
      },
      {
        accessorKey: "final_closure_date",
        header: "Final Closure Date",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
        Cell: ({ cell }) => {
          return (
            <>
              <Group>
                <div>
                  {dayjs(cell.getValue("final_closure_date")).format(
                    "MMM DD, YYYY HH:mm A"
                  )}{" "}
                </div>
                <ActionIcon>
                  <IconEdit size={"xs"} />
                </ActionIcon>
              </Group>
            </>
          );
        },
      },
      {
        accessorKey: "academic_year.name",
        header: "Academic Year",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
    ],
    [getCommonEditTextInputProps]
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
            <Tooltip withArrow position="right" label="Delete">
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
  const supabase = useSupabaseClient();
  const [academic, setAcademic] = useState([]);
  const form = useForm({
    initialValues: {
      name: "",
      closure: [],
      academic_id: "",
    },
    validate: {
      academic_id: (val) => (val ? null : "This field is required"),
      closure: (val) => (val.length === 0 ? "This field is required" : null),
    },
  });
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("academic_year").select("*");
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) setAcademic(data);
    })();
  }, [supabase]);
  useEffect(() => console.log(form.values), [form.values]);

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
      title="Add New Campaign"
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
            placeholder="Type campaign name"
          />
          <DatePickerInput
            type="range"
            popoverProps={{ withinPortal: true }}
            label={
              <Group spacing={"sm"}>
                <Text>Closure Date - Final Closure Date</Text>
                <Tooltip
                  label="The campaign is no longer accept new ideas after closure date,
                  but comments are allowed until final closure date."
                  multiline
                >
                  <IconQuestionCircle size={14} strokeWidth={1.5} />
                </Tooltip>
              </Group>
            }
            placeholder="Pick dates"
            minDate={dayjs(Date.now()).add(1, "day").toDate()}
            {...form.getInputProps("closure")}
          />
          <Select
            required
            withAsterisk
            data={academic.map((a) => ({ label: a?.name, value: a?.id }))}
            label="Academic Year"
            {...form.getInputProps("academic_id")}
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
export const UpdateExistCampaignModal = ({ table, row }) => {
  const supabase = useSupabaseClient();
  const [academic, setAcademic] = useState([]);
  const form = useForm({
    initialValues: {
      name: row.original.name,
      closure: [
        dayjs(row.original.closure_date).toDate(),
        dayjs(row.original.final_closure_date).toDate(),
      ],
      academic_id: row.original.academic_id,
    },
    validate: {
      academic_id: (val) =>
        val == row.original.academic_id
          ? null
          : "Don't allow to update this field.",
      closure: (val) => (val.length === 0 ? "This field is required" : null),
    },
  });
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("academic_year").select("*");
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) setAcademic(data);
    })();
  }, [supabase]);
  useEffect(() => console.log(form.values), [form.values]);

  const handleSubmit = form.onSubmit((values) => {
    //put your validation logic here
    // onSubmit(values);
    // onClose();
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
          placeholder="Type campaign name"
        />
        {/* <DatePickerInput
          type="range"
          // dropdownType="modal"
          label={
            <Group spacing={"sm"}>
              <Text>Closure Date - Final Closure Date</Text>
              <Tooltip
                label="The campaign is no longer accept new ideas after closure date,
                  but comments are allowed until final closure date."
                multiline
              >
                <IconQuestionCircle size={14} strokeWidth={1.5} />
              </Tooltip>
            </Group>
          }
          placeholder="Pick dates"
          minDate={dayjs(Date.now()).add(1, "day").toDate()}
          {...form.getInputProps("closure")}
        /> */}
        <Select
          disabled
          required
          withAsterisk
          searchable
          data={academic.map((a) => ({ label: a?.name, value: a?.id }))}
          label="Academic Year"
          {...form.getInputProps("academic_id")}
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

const validateRequired = (value) => !!value.length;

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Campaigns Management",
    },
  };
}
