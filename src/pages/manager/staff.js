import { MantineReactTable } from "mantine-react-table";
import React, { useMemo } from "react";

export default function StaffPage() {
  const data = [
    {
      name: "John", // key "name" matches `accessorKey` in ColumnDef down below
      age: 30, // key "age" matches `accessorKey` in ColumnDef down below
    },
    {
      name: "Sara",
      age: 25,
    },
  ];
  //simple column definitions pointing to flat data
  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name", //simple accessorKey pointing to flat data
      },
      {
        header: "Age",
        accessorKey: "age", //simple accessorKey pointing to flat data
      },
    ],
    []
  );
  return (
    <div>
      <MantineReactTable
        enableColumnDragging={false}
        enableDensityToggle={false}
        columns={columns}
        data={data}
        enableRowSelection //enable some features
        enableColumnOrdering
      />
    </div>
  );
}

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Staff Management",
    },
  };
}
