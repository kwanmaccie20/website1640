import AppLayout from "@/layouts/AppLayout";
import { csvExporter } from "@/libs/csvExporter";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Popover,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  IconCheck,
  IconDownload,
  IconExternalLink,
  IconEye,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import { useEffect, useMemo } from "react";
import useSWR from "swr";

// id name 2 closure, aca id

export default function Ideas() {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const {
    data: tableData,
    isLoading,
    isValidating,
    mutate,
    error,
  } = useSWR("ideas", async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select("*, tags(name), staff(email), campaigns(name)")
      .order("created_at", { ascending: true });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    return data;
  });
  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  const handleDeleteRow = async (row) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <>
          <Text size="sm">
            Are you sure to delete idea {row.getValue("name")}?
          </Text>
        </>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => modals.closeAll(),
      onConfirm: async () => {
        const { error, data } = await supabase
          .from("ideas")
          .delete()
          .eq("id", row.original.id)
          .select("id")
          .single();
        if (data) {
          modals.closeAll();
          mutate();
          notifications.show({
            title: "Idea deleted successfully",
            icon: <IconCheck />,
          });
        }
        if (error) {
          notifications.show({
            title: "An error occurs",
            message: `Could not delete idea`,
            icon: <IconX />,
            color: "red",
          });
        }
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Idea",
        Cell: ({ cell }) => <Text lineClamp={2}>{cell.getValue("title")}</Text>,
      },
      {
        accessorKey: "staff.email",
        header: "Author",
        Cell: ({ cell }) =>
          cell.row.original.is_anonymous == true ? (
            <Popover>
              <Group>
                <Text color="dimmed">Anonymous</Text>
                <Popover.Target>
                  <ActionIcon
                    color={theme.fn.primaryColor()}
                    variant="transparent"
                    title="Reveal"
                  >
                    <IconEye />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  {cell.getValue("staff.email")}
                </Popover.Dropdown>
              </Group>
            </Popover>
          ) : (
            <Text lineClamp={2}> {cell.getValue("staff.email")} </Text>
          ),
      },
      {
        accessorKey: "campaigns.name",
        header: "Campaign",
        Cell: ({ cell }) => (
          <Text lineClamp={2}>{cell.getValue("campaigns.name")}</Text>
        ),
      },
      {
        accessorKey: "tags.name",
        header: "Tag",
        Cell: ({ cell }) => (
          <Text lineClamp={2}>{cell.getValue("tags.name")}</Text>
        ),
      },
    ],
    []
  );

  const handleExportData = () => {
    csvExporter(columns).generateCsv(tableData);
  };

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
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Tooltip withArrow position="left" label="View">
              <ActionIcon
                onClick={() => alert(JSON.stringify(row.original, null, 2))}
              >
                <IconExternalLink />
              </ActionIcon>
            </Tooltip>
            <Tooltip withArrow position="left" label="Delete">
              <ActionIcon color={"red"} onClick={() => handleDeleteRow(row)}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              padding: "8px",
              flexWrap: "wrap",
            }}
          >
            <Button
              color={theme.fn.primaryColor()}
              onClick={handleExportData}
              leftIcon={<IconDownload />}
              variant="filled"
            >
              Export all data
            </Button>
          </Box>
        )}
      />
    </>
  );
}

Ideas.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Idea Management",
    },
  };
}
