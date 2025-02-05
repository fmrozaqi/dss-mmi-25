"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Dot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Criteria, data } from "../table/page";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const columns: ColumnDef<Criteria>[] = [
  {
    accessorKey: "criteria",
    header: ({ table }) => (
      <Button variant="ghost" onClick={table.getToggleAllRowsExpandedHandler()}>
        Criteria
        {table.getIsAllRowsExpanded() ? <ChevronDown /> : <ChevronRight />}
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex" style={{ paddingLeft: `${row.depth * 2}rem` }}>
        {row.getCanExpand() ? (
          <Button
            variant="ghost"
            onClick={row.getToggleExpandedHandler()}
            style={{ cursor: "pointer" }}
          >
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
            {row.getValue("criteria")}
          </Button>
        ) : (
          <Button variant="ghost" className="cursor-auto">
            <Dot />
            {row.getValue("criteria")}
          </Button>
        )}
      </div>
    ),
  },
  {
    accessorKey: "weight",
    header: () => <div className="text-center">Weight</div>,
    cell: ({ row }) => (
      <div className="w-full">
        <Button variant="ghost" className="w-20 mx-auto">
          {row.getValue("weight")}
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "score",
    header: () => <div className="text-center">Score</div>,
    cell: ({}) => (
      <div className="w-full">
        <Input className="w-20 mx-auto" type="number" />
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: () => <div className="">Note</div>,
    cell: ({}) => <Input placeholder="Add note..." />,
  },
];

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [expanded, setExpanded] = React.useState<ExpandedState>(true);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subCriteria,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
  });

  return (
    <div className="w-full px-20 pt-5">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Decision Maker Name</CardTitle>
            <CardDescription>DM Role</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="flex items-center py-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select alternative" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Alternative</SelectLabel>
              <SelectItem value="alternative1">Alternative 1</SelectItem>
              <SelectItem value="alternative2">Alternative 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
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
                            header.getContext()
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
                        cell.getContext()
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
    </div>
  );
}
