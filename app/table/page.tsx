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
import {
  ChevronDown,
  ChevronRight,
  Dot,
  PlusSquare,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Criteria } from "@/types/DSSType";
import { useDSSInput } from "@/hooks/useDSSInput";

export const data: Criteria[] = [
  {
    id: "m5gr84i9",
    name: "Criteria 1",
    weight: 1.5,
    type: "benefit",
    subCriteria: [
      {
        id: "m5gr84i9",
        name: "Sub Criteria 1",
        weight: 1.5,
        type: "benefit",
        subCriteria: [],
      },
      {
        id: "m5gr84i9",
        name: "Sub Criteria 2",
        weight: 2.5,
        type: "benefit",
        subCriteria: [],
      },
    ],
  },
  {
    id: "3u1reuv4",
    name: "Criteria 2",
    weight: 1,
    type: "cost",
    subCriteria: [],
  },
];

export default function DataTableDemo() {
  const dss = useDSSInput();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const columns: ColumnDef<Criteria>[] = [
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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            console.log(value, row.id);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ table }) => (
        <Button
          variant="ghost"
          onClick={table.getToggleAllRowsExpandedHandler()}
        >
          Criteria
          {table.getIsAllRowsExpanded() ? <ChevronDown /> : <ChevronRight />}
        </Button>
      ),
      cell: ({ row }) => (
        //   <div className="capitalize">{row.getValue("status")}</div>
        <div className="flex" style={{ paddingLeft: `${row.depth * 2}rem` }}>
          {row.getCanExpand() ? (
            <Button variant="ghost" onClick={row.getToggleExpandedHandler()}>
              {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
            </Button>
          ) : (
            <Button variant="ghost" className="cursor-auto">
              <Dot />
            </Button>
          )}
          <Input
            placeholder="Criteria name..."
            value={row.getValue("name")}
            onChange={(e) =>
              dss.updateCriterias(row.original.id, { name: e.target.value })
            }
          />
          <>{}</>
        </div>
      ),
    },
    {
      accessorKey: "weight",
      header: () => <div className="text-center">Weight</div>,
      cell: ({ row }) => (
        <div className="w-full">
          <Input
            value={row.getValue("weight")}
            className="w-20 mx-auto"
            type="number"
            step="0.1"
            onChange={(e) =>
              dss.updateCriterias(row.original.id, {
                weight: parseFloat(e.target.value),
              })
            }
          />
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div className="text-center">Type</div>,
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          {!row.parentId && (
            <Select
              value={row.getValue("type")}
              onValueChange={(value) =>
                dss.updateCriterias(row.original.id, {
                  type: value === "benefit" ? "benefit" : "cost",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="benefit">Benefit</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => dss.deleteCriteria(row.original.id)}
                >
                  <span className="sr-only">Delete criteria</span>
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete criteria</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "add",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => dss.addSubCriteria(row.original.id)}
                >
                  <span className="sr-only">Add sub criteria</span>
                  <PlusSquare />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add sub criteria</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
  ];

  // React.useEffect(() => {
  //   console.log(rowSelection);
  // }, [rowSelection]);

  const table = useReactTable({
    data: dss.criterias,
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
      <div className="flex items-center py-4">
        <Button variant="default" onClick={dss.addCriteria}>
          Add Criteria
        </Button>
      </div>
    </div>
  );
}
