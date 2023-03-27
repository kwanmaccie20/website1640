import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useMemo, useState } from "react";
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
      .select("*, staff!departments_coordinator_id_fkey(email,id)");
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    return data;
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = (values) => {
    mutate([...tableData, values]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      mutate([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = (row) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">Are you sure to delete {row.getValue("name")}</Text>
      ),
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
        header: "Department Name",
        mantineEditTextInputProps: ({ cell }) => ({
          ...getCommonEditTextInputProps(cell),
        }),
      },
      {
        accessorKey: "staff.email",
        header: "Coordinator Email",
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
        onEditingRowSave={handleSaveRowEdits}
        mantineToolbarAlertBannerProps={
          error
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        state={{
          isLoading: isLoading || (!isLoading && tableData.length == 0),
          showAlertBanner: error,
        }}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="Edit">
              <ActionIcon onClick={() => table.setEditingRow(row)}>
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
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
}

//example of creating a mantine dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Modal opened={open} onClose={onClose} title="Create New Department">
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack
          sx={{
            width: "100%",
          }}
        >
          {columns.map((column) => (
            <TextInput
              key={column.accessorKey}
              label={column.header}
              name={column.accessorKey}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          ))}
        </Stack>
      </form>
      <Group position="right" mt={"lg"}>
        <Button onClick={onClose} variant="subtle">
          Cancel
        </Button>
        <Button color="teal" onClick={handleSubmit} variant="filled">
          Create
        </Button>
      </Group>
    </Modal>
  );
};

const validateRequired = (value) => !!value.length;
