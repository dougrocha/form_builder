"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "~/components/ui/button";

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
    accessorKey: "id",
    header: "Id",
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
