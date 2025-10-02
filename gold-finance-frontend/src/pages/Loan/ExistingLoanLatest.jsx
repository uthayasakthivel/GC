import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import LoansTable from "../../components/LoansTable";

export default function ExistingLoanTab() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;
    try {
      await axiosInstance.delete(`/loan/${id}`);
      setLoans((prev) => prev.filter((loan) => loan._id !== id));
    } catch (err) {
      console.error("Failed to delete loan", err);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL loans?")) return;
    try {
      await axiosInstance.delete("/loan");
      setLoans([]);
    } catch (err) {
      console.error("Failed to delete all loans", err);
    }
  };

  const columns = [
    { accessorKey: "customerData.customerName", header: "Customer" },
    { accessorKey: "customerData.phoneNumber", header: "Ph Number" },
    { accessorKey: "previewData.customerId", header: "Customer ID" },
    { accessorKey: "loanId", header: "Loan ID" },
    { accessorKey: "loanAmount", header: "Loan Amount" },
    { accessorKey: "totalInterest", header: "Interest Rate" },
    {
      accessorKey: "_id",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => navigate(`/loan/${row.original._id}`)}
          >
            View
          </button>
          {user?.role === "admin" && (
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(row.original._id)}
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchLatestLoans = async () => {
      try {
        const res = await axiosInstance.get("/loan/latest");
        if (res.data.success) setLoans(res.data.loans);
      } catch (err) {
        console.error("Failed to fetch latest loans", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestLoans();
  }, []);

  const handleViewAll = () => navigate("/all-loans");

  return (
    <div className="p-4 border rounded shadow bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Existing Loans</h2>
        {user?.role === "admin" && loans.length > 0 && (
          <button
            className="bg-red-700 text-white px-4 py-2 rounded"
            onClick={handleDeleteAll}
          >
            Delete All
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading loans...</p>
      ) : loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        <>
          <LoansTable loans={loans} columns={columns} simple={true} />
          <button
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
            onClick={handleViewAll}
          >
            View All
          </button>
        </>
      )}
    </div>
  );
}
