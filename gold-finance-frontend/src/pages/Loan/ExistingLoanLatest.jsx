import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import LoansTable from "../../components/LoansTable";

export default function ExistingLoanTab() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    { accessorKey: "customerData.customerName", header: "Customer" },
    { accessorKey: "customerData.phoneNumber", header: "Ph Number" },
    { accessorKey: "previewData.customerId", header: "Customer ID" },
    { accessorKey: "loanId", header: "Loan ID" },
    { accessorKey: "loanAmount", header: "Loan Amount" },
    { accessorKey: "totalInterest", header: "Interest Rate" },
    {
      accessorKey: "_id", // matches your data
      header: "Actions",
      cell: ({ row }) => (
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => navigate(`/loan/${row.original._id}`)}
        >
          View
        </button>
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
      <h2 className="text-xl font-bold mb-4">Existing Loans</h2>

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
