import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { Criteria } from "@/types/DSSType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const CriteriaTable: React.FC<{ data: Criteria[] }> = ({ data }) => {
  const columns: ColumnDef<Criteria>[] = [
    {
      accessorKey: "name",
      header: "Criteria",
      cell: (info) => (
        <div
          className="flex"
          style={{ paddingLeft: `${info.row.depth * 1.1}rem` }}
        >
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "weight",
      header: "Weight",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: (info) => info.getValue() ?? "-",
    },
  ];

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subCriteria,
    state: {
      expanded: true,
    },
  });

  return (
    <div className="p-4 border rounded-lg">
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
};

export default CriteriaTable;
