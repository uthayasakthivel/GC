import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "../api/axiosInstance";

// Global Search Input
function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <input
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value)}
      placeholder="Search by customer name or sheet number..."
      className="border px-3 py-2 mb-4 w-full md:w-1/3 rounded"
    />
  );
}

// Fuzzy Filter Function for Global Search
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, {
    keys: ["original.customerName", "original.sheetNumber"],
  });
}
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Checkbox for Row Selection
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    return <input type="checkbox" ref={resolvedRef} {...rest} />;
  }
);

export default function SubmittedSheetsTable({ data, sheetType }) {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        Header: "Sheet No",
        accessor: "sheetNumber",
      },
      ...(sheetType !== "melting"
        ? [
            {
              Header: "Customer Name",
              accessor: "customerName",
            },
          ]
        : []),
      //  clearer format like 7 Aug 2025
      {
        Header: "Date",
        accessor: (row) =>
          new Date(row.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        id: "date",
      },

      //   This format 07/08/2025,
      // {
      //   Header: "Date",
      //   accessor: (row) => new Date(row.date).toLocaleDateString("en-IN"),
      //   id: "date",
      // },

      {
        Header: "Action",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => (
          <button
            onClick={() =>
              navigate(`/admin/sheets/${sheetType}/${row.original._id}`)
            }
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            Preview
          </button>
        ),
      },
    ],
    [navigate]
  );

  const defaultColumn = useMemo(() => ({ Filter: "" }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    setPageSize,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes: {
        fuzzyText: fuzzyTextFilterFn,
      },
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        globalFilter: "",
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  const { globalFilter, pageIndex, pageSize } = state;
  const selectedIds = selectedFlatRows.map((row) => row.original._id);

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("No sheets selected.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete selected sheets?"))
      return;

    try {
      await axios.post(`/sheet/${sheetType}-sheet/delete-selected`, {
        ids: selectedIds,
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete selected sheets:", err);
      alert("Delete selected failed.");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL sheets?")) return;

    try {
      await axios.delete(`/sheet/${sheetType}-sheet`);
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete all sheets:", err);
      alert("Delete all failed.");
    }
  };
  return (
    <>
      <GlobalFilter
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected
        </button>
        <button
          onClick={handleDeleteAll}
          className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded"
        >
          Delete All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full border text-left bg-white"
        >
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const headerProps = column.getHeaderProps(
                    column.getSortByToggleProps?.()
                  );
                  const { key, ...rest } = headerProps;

                  return (
                    <th
                      key={key}
                      {...rest}
                      className="border p-2 cursor-pointer"
                    >
                      {column.render("Header")}
                      <span className="ml-1">
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="border p-2">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="ml-2 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
