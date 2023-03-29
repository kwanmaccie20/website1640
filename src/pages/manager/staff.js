import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Overlay,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { closeModal, modals } from "@mantine/modals";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MantineReactTable } from "mantine-react-table";
import { title } from "process";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { mutate as mtate } from "swr";
export default function Department() {
  const supabase = useSupabaseClient();
  const theme = useMantineTheme();
  const {
    data: tableData,
    isLoading,
    isValidating,
    mutate,
    error,
  } = useSWR("staff", async () => {
    const { data, error } = await supabase
      .from("staff")
      .select("*, departments!staff_department_id_fkey(*),roles(name)")
      .order("first_name", { ascending: true });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    return data;
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateNewRow = async (values) => {
    const res = await fetch("/api/create_user", {
      method: "POST",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const getRes = await res.json();
    if (getRes?.data) {
      mutate([...tableData, getRes.data]);
    } else {
      alert("We are having trouble adding new staff to the system.");
    }
  };

  const handleUpdateRow = (table, row) => {
    modals.open({
      title: "Update the staff profiles",
      children: <UpdateExistModal table={table} row={row} />,
      modalId: "20092001",
    });
  };
  const handleDeleteRow = (row) => {
    if (row.original.role_id !== 3) {
      modals.openConfirmModal({
        title: "Delete staff from the system",
        children: (
          <Text size="sm">
            Are you sure to delete {row.original.first_name}{" "}
            {row.original.last_name}?
          </Text>
        ),
        labels: { confirm: "Delete", cancel: "Cancel" },
        onCancel: () => modals.closeAll(),
        onConfirm: async () => {
          const res = await fetch("/api/delusr", {
            method: "POST",
            header: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: row.original.id }),
          });
          const getRes = await res.json();
          console.log("----", getRes);
          if (getRes?.data) {
            mutate();
          } else {
            alert("We are having trouble deleting the staff.");
          }
        },
      });
    } else {
      modals.open({
        title: "Could not to delete user",
        children: (
          <div>
            <Text size={"sm"}>
              Prior to proceeding, it is imperative to remove the user being
              deleted from their current position (coordinator).
            </Text>
            <Button
              mt={"md"}
              className="w-full"
              onClick={() => modals.close("20102010")}
            >
              Understood
            </Button>
          </div>
        ),
        modalId: "20102010",
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "first_name",
        header: "First Name",
        Cell: ({ cell }) => (
          <Text lineClamp={2}>{cell.getValue("first_name")}</Text>
        ),
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
        Cell: ({ cell }) => (
          <Text lineClamp={2}>{cell.getValue("last_name")}</Text>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        Cell: ({ cell }) => <Text lineClamp={2}>{cell.getValue("email")}</Text>,
      },
      {
        accessorKey: "gender",
        header: "Gender",
      },
      {
        accessorKey: "phone",
        header: "Phone",
        Cell: ({ cell }) => <Text lineClamp={2}>{cell.getValue("phone")}</Text>,
      },
      {
        accessorKey: "address",
        header: "Address",
        Cell: ({ cell }) => (
          <Text lineClamp={2}>{cell.getValue("address")}</Text>
        ),
      },
      {
        accessorKey: "departments.name",
        header: "Department",
        Cell: ({ cell }) =>
          cell.getValue("departments.name") ? (
            <Text lineClamp={2}>{cell.getValue("departments.name")}</Text>
          ) : (
            <Text color="dimmed"> No department</Text>
          ),
      },
      {
        accessorKey: "roles.name",
        header: "Role",
      },
    ],
    []
  );

  return (
    <>
      <MantineReactTable
        columns={columns}
        data={tableData ?? []}
        // editingMode="modal" //default
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

export const CreateNewModal = ({ open, columns, onClose, onSubmit }) => {
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  const [roleList, setRoleList] = useState([]);

  const getRole = async () => {
    const { data: roles, error } = await supabase
      .from("roles")
      .select("id,name,title");
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    if (roles) {
      const roleValue = [];
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].title === "qa_coordinator") continue;
        const pushData = {
          value: roles[i].id,
          label: roles[i].name,
          title: roles[i].title,
        };
        roleValue.push(pushData);
      }
      setRoleList(roleValue);
    }
  };
  useEffect(() => {
    getRole();
  }, []);

  const newStaffForm = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      role_id: "",
      phone: "",
      gender: "",
      address: "",
    },
    validate: {
      email: (value) => (isEmail(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = newStaffForm.onSubmit((val) => {
    // if (
    //   roleList.find((e) => e.value == newStaffForm.values.role_id).title ==
    //   "qa_coordinator"
    // )
    //   modals.openConfirmModal({
    //     title: "A coordinator may be assigned to the department.",
    //     children: (
    //       <div className="">
    //         <Text size={"sm"} color="dimmed">
    //           Do you want to continue? If the decision is affirmative, it is to
    //           be noted that the present coordinator will be re-assigned to a
    //           staff role.
    //         </Text>
    //       </div>
    //     ),
    //     labels: { cancel: "Cancel", confirm: "Continue" },
    //     onCancel: () => {
    //       modals.close("20102001");
    //     },
    //     modalId: "20102001",
    //     closeOnClickOutside: false,
    //     onConfirm: () => {
    //       onSubmit(val);
    //       newStaffForm.reset();
    //       onClose();
    //     },
    //   });
    // else {
    onSubmit(val);
    newStaffForm.reset();
    onClose();
    // }
  });

  return (
    <Modal opened={open} onClose={onClose} title="Create New Staff">
      <form onSubmit={handleSubmit}>
        <Stack
          sx={{
            width: "100%",
          }}
        >
          <Group grow>
            <TextInput
              required
              withAsterisk
              label="First name"
              placeholder="Type first name"
              {...newStaffForm.getInputProps("first_name")}
            />
            <TextInput
              required
              withAsterisk
              label="Last name"
              placeholder="Type last name"
              {...newStaffForm.getInputProps("last_name")}
            />
          </Group>
          <Group grow>
            <TextInput
              required
              withAsterisk
              label="Phone number"
              placeholder="Type phone number"
              {...newStaffForm.getInputProps("phone")}
            />
            <Select
              required
              withAsterisk
              label="Gender"
              placeholder="Pick gender"
              data={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              searchable={true}
              {...newStaffForm.getInputProps("gender")}
            />
          </Group>
          <TextInput
            required
            withAsterisk
            label="Email"
            placeholder="Type email"
            {...newStaffForm.getInputProps("email")}
          />
          <Textarea
            required
            withAsterisk
            label="Address"
            placeholder="Type address"
            {...newStaffForm.getInputProps("address")}
          />
          <Select
            required
            withAsterisk
            label="Role"
            placeholder="Pick role"
            data={roleList}
            searchable={true}
            {...newStaffForm.getInputProps("role_id")}
          />
        </Stack>
        <Group position="right" mt={"lg"}>
          <Button onClick={onClose} variant="subtle">
            Cancel
          </Button>
          <Button
            color={theme.fn.primaryColor()}
            type="submit"
            variant="filled"
          >
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export const UpdateExistModal = ({ table, row }) => {
  const theme = useMantineTheme();
  const supabase = useSupabaseClient();
  // const [departmentList, setDepartmentList] = useState([]);
  const [roleList, setRoleList] = useState([]);

  // const getDepartment = async () => {
  //   const { data: departments, error } = await supabase
  //     .from("departments")
  //     .select("id,name");
  //   if (error) {
  //     console.log(error);
  //     throw new Error(error.message);
  //   }
  //   if (departments) {
  //     const departmentValue = [];
  //     for (let i = 0; i < departments.length; i++) {
  //       const pushData = {
  //         value: departments[i].id,
  //         label: departments[i].name,
  //       };
  //       departmentValue.push(pushData);
  //     }
  //     setDepartmentList(departmentValue);
  //   }
  // };
  const getRole = async () => {
    const { data: roles, error } = await supabase
      .from("roles")
      .select("id,name,title");
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    if (roles) {
      const roleValue = [];
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].title === "qa_coordinator") continue;
        const pushData = {
          value: roles[i].id,
          label: roles[i].name,
          title: roles[i].title,
        };
        roleValue.push(pushData);
      }
      setRoleList(roleValue);
    }
  };
  useEffect(() => {
    // getDepartment();
    getRole();
  }, []);

  const newStaffForm = useForm({
    initialValues: {
      email: row.original.email,
      first_name: row.original.first_name,
      last_name: row.original.last_name,
      // department_id: row.original.department_id,
      role_id: row.original.role_id,
      phone: row.original.phone,
      gender: row.original.gender,
      address: row.original.address,
    },
    validate: {
      email: (value) =>
        value == row.original.email ? null : "Don't allow to change email.",
      department_id: (value) =>
        value == row.original.department_id
          ? null
          : "Please access department to change the department for this user.",
    },
  });
  // useEffect(() => {
  //   console.log(newStaffForm.values);
  // }, [newStaffForm, newStaffForm.values]);

  const handleSubmit = newStaffForm.onSubmit(async (val) => {
    if (val.email != row.original.email) val.email = row.original.email;
    const { data, error } = await supabase
      .from("staff")
      .update({ ...val })
      .eq("id", row.original.id)
      .select("id");
    if (error) {
      alert("We are having trouble updating staff information.");
    }
    if (data) {
      //Update coordinator of the department
      // const { data: roleData, error: roleError } = await supabase
      //   .from("roles")
      //   .select("id,title")
      //   .eq("id", val.role_id)
      //   .single();
      // if (roleData && roleData.title == "qa_coordinator") {
      //   //Update user// return current coordinator to staff
      //   const { data: roleStaff, error: roleStaffError } = await supabase
      //     .from("roles")
      //     .select("id,title")
      //     .eq("title", "staff")
      //     .single();
      //   if (roleStaff) {
      //     const { data: updateCurrentCoordinator, error: updateCoorError } =
      //       await supabase
      //         .from("staff")
      //         .update({ role_id: roleStaff.id })
      //         .eq("role_id", val.role_id)
      //         .eq("department_id", val.department_id)
      //         .neq("id", row.original.id);
      //   }
      //   //New coordinator
      //   const { data: departmentData, error: departmentError } = await supabase
      //     .from("departments")
      //     .update({ coordinator_id: row.original.id })
      //     .eq("id", val.department_id);
      // }
      modals.close("20092001");
      mtate("staff");
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <Group grow>
          <TextInput
            required
            withAsterisk
            label="First name"
            placeholder="Type first name"
            {...newStaffForm.getInputProps("first_name")}
          />
          <TextInput
            required
            withAsterisk
            label="Last name"
            placeholder="Type last name"
            {...newStaffForm.getInputProps("last_name")}
          />
        </Group>
        <Group grow>
          <TextInput
            required
            withAsterisk
            label="Phone number"
            placeholder="Type phone number"
            {...newStaffForm.getInputProps("phone")}
          />
          <Select
            required
            withAsterisk
            label="Gender"
            placeholder="Pick gender"
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            searchable={true}
            {...newStaffForm.getInputProps("gender")}
          />
        </Group>
        <TextInput
          disabled
          required
          withAsterisk
          label="Email"
          placeholder="Type email"
          {...newStaffForm.getInputProps("email")}
        />
        <Textarea
          required
          withAsterisk
          label="Address"
          placeholder="Type address"
          {...newStaffForm.getInputProps("address")}
        />
        {/* <Select
          required
          withAsterisk
          disabled
          label="Department"
          placeholder="Pick Department"
          data={departmentList}
          searchable={true}
          {...newStaffForm.getInputProps("department_id")}
        /> */}
        <Select
          disabled={row.original.role_id == 3}
          required
          withAsterisk
          label="Role"
          placeholder={
            row.original.role_id == 3 ? "QA Coordinator" : "Pick role"
          }
          data={roleList}
          searchable={true}
          {...newStaffForm.getInputProps("role_id")}
        />
      </Stack>
      <Group position="right" mt={"lg"}>
        <Button variant={"light"} onClick={() => closeModal("20092001")}>
          Close
        </Button>
        <Button color={theme.fn.primaryColor()} type="submit" variant="filled">
          Update
        </Button>
      </Group>
    </form>
  );
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Staff Management",
    },
  };
}
