"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  RowSelectionState,
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
import { useDMInput } from "@/hooks/useDMInput";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function AdminInput() {
  const dss = useDSSInput();
  const dms = useDMInput();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    dss.getActiveState()
  );

  const [expanded, setExpanded] = React.useState<ExpandedState>(true);

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
          onCheckedChange={(value) => row.toggleSelected(!!value)}
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
    onRowSelectionChange: (updater) => {
      setRowSelection((old) => {
        const newValue = updater instanceof Function ? updater(old) : updater;
        const selectedRows: RowSelectionState = {};
        for (const key in newValue) {
          const parentKey = key.split(".").slice(0, -1).join(".");
          if (!parentKey || parentKey in selectedRows) {
            selectedRows[key] = newValue[key];
          }
        }
        dss.updateActiveStatus(selectedRows);

        return selectedRows;
      });
    },
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
    <>
      {mounted ? (
        <div className="w-4/5 px-20 pt-5 mx-auto space-y-6">
          {/* Table Section */}
          <Toaster />
          <h1 className="text-2xl font-bold text-gray-800">Criteria Input</h1>
          <div className="rounded-md border shadow-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
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

          {/* Criteria Actions */}
          <div className="flex space-x-4">
            <Button variant="default" onClick={dss.addCriteria}>
              Add Criteria
            </Button>
            <Button
              variant="default"
              onClick={() => {
                dss.saveCriterias();
                toast("Saved", {
                  description: "Criteria telah disimpan",
                });
              }}
            >
              Save Criteria
            </Button>
          </div>

          {/* Alternatives List */}
          <h1 className="text-2xl font-bold text-gray-800">
            Alternative Input
          </h1>
          <div className="space-y-3">
            {dss.alternatives.map((alternative) => (
              <div key={alternative.id} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Alternative Name"
                  value={alternative.name}
                  className="w-full"
                  onChange={(e) =>
                    dss.updateAlternatives(alternative.id, {
                      name: e.target.value,
                    })
                  }
                />
                <Button
                  variant="destructive"
                  onClick={() => dss.removeAlternative(alternative.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>

          {/* Alternative Actions */}
          <div className="flex space-x-4">
            <Button variant="default" onClick={() => dss.addAlternative()}>
              Add Alternative
            </Button>
            <Button
              variant="default"
              onClick={() => {
                dss.saveAlternatives();
                toast("Saved", {
                  description: "Alternative telah disimpan",
                });
              }}
            >
              Save Alternative
            </Button>
          </div>

          {/* Decision Makers List */}
          <h1 className="text-2xl font-bold text-gray-800">
            Decision Maker Input
          </h1>
          <div className="space-y-3">
            {dms.decisionMakers.map((dm) => (
              <div key={dm.id} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Decision Maker Name"
                  value={dm.name}
                  className="w-3/5"
                  onChange={(e) =>
                    dms.updateDecisionMaker(dm.id, { name: e.target.value })
                  }
                />
                <Input
                  type="text"
                  placeholder="Decision Maker Role"
                  value={dm.role}
                  className="w-2/5"
                  onChange={(e) =>
                    dms.updateDecisionMaker(dm.id, { role: e.target.value })
                  }
                />
                <Button onClick={() => window.open(`/form/${dm.id}`, "_blank")}>
                  Form
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => dms.removeDecisionMaker(dm.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>

          {/* Decision Maker Actions */}
          <div className="flex space-x-4">
            <Button variant="default" onClick={() => dms.addDecisionMaker()}>
              Add Decision Maker
            </Button>
            <Button
              variant="default"
              onClick={() => {
                dms.saveFormDecisionMakers();
                toast("Saved", {
                  description: "DM telah disimpan",
                });
              }}
            >
              Save Decision Maker
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
