import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function LoansTable({
  loans = [],
  columns = [],
  simple = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  // ✅ Filter logic (only apply if not simple)
  const filteredLoans = useMemo(() => {
    if (!searchTerm || simple) return loans;

    const lowerSearch = searchTerm.toLowerCase();
    return loans.filter((loan) => {
      const customerName = loan.customerData?.customerName?.toLowerCase() || "";
      const phoneNumber = loan.customerData?.phoneNumber?.toLowerCase() || "";
      const customerId = loan.customerId?.toLowerCase() || "";
      const loanId = loan.loanId?.toLowerCase() || "";

      return (
        customerName.includes(lowerSearch) ||
        phoneNumber.includes(lowerSearch) ||
        customerId.includes(lowerSearch) ||
        loanId.includes(lowerSearch)
      );
    });
  }, [searchTerm, loans, simple]);

  // ✅ Table instance
  const table = useReactTable({
    data: filteredLoans,
    columns,
    state: {
      sorting: simple ? [] : sorting,
      pagination: simple ? {} : pagination,
    },
    onSortingChange: simple ? undefined : setSorting,
    onPaginationChange: simple ? undefined : setPagination,
    getCoreRowModel: getCoreRowModel(),
    ...(simple
      ? {} // No sorting or pagination
      : {
          getSortedRowModel: getSortedRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }),
  });

  return (
    <div>
      {/* ✅ Search Bar - Hide if simple */}
      {!simple && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Name, Phone, Loan ID, Customer ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      )}

      {/* ✅ Table */}
      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border px-4 py-2 bg-gray-200 text-left select-none"
                  {...(!simple && {
                    onClick: header.column.getToggleSortingHandler(),
                    className:
                      "border px-4 py-2 bg-gray-200 text-left cursor-pointer select-none",
                  })}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {!simple && header.column.getIsSorted() === "asc" && " 🔼"}
                  {!simple && header.column.getIsSorted() === "desc" && " 🔽"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Pagination Controls - Hide if simple */}
      {!simple && (
        <>
          <div className="flex items-center justify-between mt-4">
            <div>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="space-x-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
          </div>

          <div className="mt-2">
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border p-1 rounded"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
