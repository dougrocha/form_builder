"use client";

import { useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { Loader } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useTRPC } from "~/trpc/react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  rowCount: number;
}

export function DataTable<TData, TValue>({
  columns,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const { form_id } = useParams();
  const searchParams = useSearchParams();

  const pageIndex = Number(searchParams.get("page")) || 0;
  const pageSize = Number(searchParams.get("size")) || 10;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.form.getFormResponses.queryOptions({
      formId: Number(form_id),
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    }),
  );

  const table = useReactTable({
    data: data as TData[],
    columns,
    rowCount,
    state: {
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", String(pagination.pageIndex));
    current.set("size", String(pagination.pageSize));
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`);
  }, [pagination, pathname, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-grow items-center justify-center">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
