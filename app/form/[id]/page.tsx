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
import { Criteria } from "@/types/DSSType";
import { useDSSInput } from "@/hooks/useDSSInput";
import { use } from "react";
import { useDMInput } from "@/hooks/useDMInput";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DataTableDemo({ params }: PageProps) {
  const dss = useDSSInput();
  const dms = useDMInput();

  const [selectedAlternative, setSelectedAlternative] =
    React.useState<string>("");

  const { id } = use(params);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [expanded, setExpanded] = React.useState<ExpandedState>(true);

  const getAlternativeScore = (alternativeId: string) => {
    return dms
      .getDecisionMakerById(id)
      ?.alternatives?.find((alternative) => alternative.id === alternativeId);
  };

  const columns: ColumnDef<Criteria>[] = [
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
        <div className="flex" style={{ paddingLeft: `${row.depth * 2}rem` }}>
          {row.getCanExpand() ? (
            <Button
              variant="ghost"
              onClick={row.getToggleExpandedHandler()}
              style={{ cursor: "pointer" }}
            >
              {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
              {row.getValue("name")}
            </Button>
          ) : (
            <Button variant="ghost" className="cursor-auto">
              <Dot />
              {row.getValue("name")}
            </Button>
          )}
        </div>
      ),
    },
    {
      accessorKey: "weight",
      header: () => <div className="text-center">Weight</div>,
      cell: ({ row }) => (
        <div className="flex justify-center w-full">
          <Button variant="ghost" className="w-20 mx-auto">
            {row.getValue("weight")}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "score",
      header: () => <div className="text-center">Score</div>,
      cell: ({ row }) => {
        return (
          <div className="w-full">
            {row.original.subCriteria.length === 0 && (
              <Input
                className="w-20 mx-auto"
                type="number"
                value={row.original.score}
                onChange={(e) =>
                  dms.updateScore(
                    id,
                    selectedAlternative,
                    row.original.id,
                    parseInt(e.target.value)
                  )
                }
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "note",
      header: () => <div className="">Note</div>,
      cell: ({}) => <Input placeholder="Add note..." />,
    },
  ];

  const table = useReactTable({
    data: getAlternativeScore(selectedAlternative!)?.score || dss.criterias,
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
    <div className="w-4/5 px-20 pt-5 mx-auto">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{dms.getDecisionMakerById(id)?.name}</CardTitle>
            <CardDescription>
              {dms.getDecisionMakerById(id)?.role}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="flex items-center py-4">
        <Select
          onValueChange={(value) => setSelectedAlternative(value)}
          value={selectedAlternative}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select alternative" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Alternative</SelectLabel>
              {dms
                .getDecisionMakerById(id)
                ?.alternatives?.map((alternative) => (
                  <SelectItem key={alternative.id} value={alternative.id}>
                    {alternative.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {selectedAlternative && (
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
      )}
      <div className="flex items-center py-4 space-x-2">
        <Button variant="default" onClick={() => dms.saveDecisionMakers()}>
          Save Decision Maker
        </Button>
      </div>
    </div>
  );
}
