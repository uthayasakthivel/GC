import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import LoansTable from "../../components/LoansTable";
import { useNavigate } from "react-router-dom";

export default function AllLoansPage() {
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
    const fetchAllLoans = async () => {
      try {
        const res = await axiosInstance.get("/loan");
        if (res.data.success) setLoans(res.data.loans);
      } catch (err) {
        console.error("Failed to fetch all loans", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLoans();
  }, []);

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">All Loans</h2>

      {loading ? (
        <p>Loading loans...</p>
      ) : loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        <LoansTable loans={loans} columns={columns} />
      )}
    </div>
  );
}
