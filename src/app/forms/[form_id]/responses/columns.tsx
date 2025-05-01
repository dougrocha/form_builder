"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Response = {
  id: number;
  formId: number;
  user: {
    name: string;
  };
  createdAt: Date;
};

export const columns: ColumnDef<Response>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user.email",
    header: "User's Email",
  },
  {
    accessorKey: "user.name",
    header: "User's Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return <>{date.toLocaleDateString()}</>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const formId: number = row.original.formId;
      const responseId: number = row.getValue("id");

      return (
        <Button asChild>
          <Link href={`/forms/${formId}/responses/${responseId}`}>
            View Details
          </Link>
        </Button>
      );
    },
  },
];
