import React, { useState, useEffect } from "react";
import LoanDetailsForm from "./LoanDetailsForm";
import { useLoan } from "../context/LoanContext";

export default function DynamicJewelleryTable({
  columns,
  initialRows,
  onDataChange,
}) {
  const {
    jewelleryOptions,
    ratePerGram,
    selectedBranch,
    loanAmount,
    setLoanAmount,
  } = useLoan();

  const [rows, setRows] = useState(
    initialRows.length
      ? initialRows
      : [
          {
            ornament: "",
            numItems: "",
            grossWeight: "",
            netWeight: "",
            ratePerGram,
            eligibleAmount: 0,
            partial: 0,
          },
        ]
  );

  console.log(selectedBranch, "selectedBranch");

  const [showLoanDetails, setShowLoanDetails] = useState(false); // New state
  // Helper to recalculate eligibleAmount and partial for all rows
  const recalculateRows = (rowsData, loanAmt) => {
    const loanAmountNum = Number(loanAmt) || 0;

    const updatedRows = rowsData.map((row) => {
      const netWeightNum = parseFloat(row.netWeight) || 0;
      const rateNum = parseFloat(row.ratePerGram) || 0;
      const eligibleAmount = netWeightNum * rateNum;
      return { ...row, eligibleAmount };
    });

    const totalEligible = updatedRows.reduce(
      (sum, r) => sum + r.eligibleAmount,
      0
    );

    // Add console logs here to debug values

    const finalRows = updatedRows.map((row) => ({
      ...row,
      partial:
        totalEligible > 0 && loanAmountNum > 0
          ? Math.ceil(
              ((loanAmountNum / totalEligible) * row.eligibleAmount) / 1000
            ) * 1000
          : row.eligibleAmount,
    }));

    return finalRows;
  };

  const handleChange = (idx, field, value) => {
    setRows((prevRows) => {
      // Update the specific field in the targeted row
      const updatedRows = prevRows.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      );

      // Recalculate eligibility and partial amounts using current loanAmount
      return recalculateRows(updatedRows, parseFloat(loanAmount) || 0);
    });
  };

  const addRow = (idx) => {
    const newRow = {
      ornament: "",
      numItems: "",
      grossWeight: "",
      netWeight: "",
      ratePerGram,
      eligibleAmount: 0,
      partial: 0,
    };
    setRows((prevRows) => {
      const updated = [...prevRows];
      updated.splice(idx + 1, 0, newRow);
      return updated;
    });
  };

  const removeRow = (idx) => {
    setRows((prevRows) => {
      if (prevRows.length === 1) return prevRows;
      return prevRows.filter((_, i) => i !== idx);
    });
  };

  // Recalculate partial amounts when loanAmount changes
  useEffect(() => {
    setRows((prevRows) =>
      recalculateRows(prevRows, parseFloat(loanAmount) || 0)
    );
  }, [loanAmount]);

  // Notify parent of data changes (optional)
  useEffect(() => {
    if (onDataChange) {
      const totalEligibility = rows.reduce(
        (sum, row) => sum + Number(row.eligibleAmount || 0),
        0
      );
      const loanNum = parseFloat(loanAmount) || 0;
      onDataChange(rows, totalEligibility, loanNum);
    }
  }, [rows, loanAmount, onDataChange]);

  const totalEligibility = rows.reduce(
    (sum, row) => sum + Number(row.eligibleAmount || 0),
    0
  );

  console.log("Parent selectedBranch:", selectedBranch);

  return (
    <div>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="border p-2 text-left">
                {col.label}
              </th>
            ))}
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key} className="border p-2">
                  {col.input ? (
                    col.type === "select" ? (
                      <select
                        value={row[col.key]}
                        onChange={(e) =>
                          handleChange(idx, col.key, e.target.value)
                        }
                        className="input border rounded px-2 py-1"
                      >
                        <option value="">Select {col.label}</option>
                        {jewelleryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={col.type || "text"}
                        step={col.step}
                        value={row[col.key]}
                        onChange={(e) =>
                          handleChange(idx, col.key, e.target.value)
                        }
                        className="input border rounded px-2 py-1"
                        readOnly={col.readOnly}
                        min={col.min}
                      />
                    )
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              <td className="border p-2 space-x-1">
                <button
                  type="button"
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => addRow(idx)}
                >
                  +
                </button>
                {rows.length > 1 && (
                  <button
                    type="button"
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => removeRow(idx)}
                  >
                    −
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-4 flex items-center">
        <label className="mb-1 font-semibold mr-2">Total Eligibility:</label>
        <span className="font-bold text-blue-600">{totalEligibility}</span>
      </div>

      <div className="flex items-center mb-4">
        <label className="block mb-1 font-semibold mr-2">Loan Amount:</label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => {
            const val = e.target.value;
            setLoanAmount(val === "" ? 0 : Number(val)); // Always number or 0
          }}
          placeholder="Enter Loan Amount"
          className="input border rounded px-2 py-1"
          min={0}
        />
      </div>
      {/* Add Loan Details Button */}
      <div className="mt-4">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowLoanDetails(true)}
        >
          Add Loan Details
        </button>
      </div>
      {/* Conditionally render another component */}
      {showLoanDetails && <LoanDetailsForm />}
    </div>
  );
}
