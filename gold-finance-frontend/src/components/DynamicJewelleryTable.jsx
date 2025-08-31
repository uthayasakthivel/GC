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
    setSelectedJewels,
    setTotalEligibility,
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
            ratePerGram: ratePerGram || 0,
            eligibleAmount: 0,
            partial: 0,
          },
        ]
  );

  const [showLoanDetails, setShowLoanDetails] = useState(false);

  // ✅ Function to recalculate eligibleAmount and partial
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
      const updatedRows = prevRows.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      );
      return recalculateRows(updatedRows, loanAmount);
    });
  };

  const addRow = (idx) => {
    const newRow = {
      ornament: "",
      numItems: "",
      grossWeight: "",
      netWeight: "",
      ratePerGram: ratePerGram || 0,
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

  // ✅ Recalculate when loanAmount changes
  useEffect(() => {
    setRows((prevRows) => recalculateRows(prevRows, loanAmount));
  }, [loanAmount]);

  // ✅ Notify parent & update context
  useEffect(() => {
    const totalEligibility = rows.reduce(
      (sum, row) => sum + Number(row.eligibleAmount || 0),
      0
    );
    const loanNum = parseFloat(loanAmount) || 0;

    if (onDataChange) {
      onDataChange(rows, totalEligibility, loanNum);
    }

    // ✅ Update context for backend payload
    setSelectedJewels(rows); // Send full rows (array of objects)
    setTotalEligibility(totalEligibility);
  }, [rows, loanAmount]);

  const totalEligibility = rows.reduce(
    (sum, row) => sum + Number(row.eligibleAmount || 0),
    0
  );

  return (
    <div className="pt-6 max-w-5xl mx-autorounded-xl space-y-6">
      <table className="min-w-full border border-gray-200 mt-2 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border-b border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700"
              >
                {col.label}
              </th>
            ))}
            <th className="border-b border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="border-b border-gray-200 px-2 py-1"
                >
                  {col.input ? (
                    col.type === "select" ? (
                      <select
                        value={row[col.key]}
                        onChange={(e) =>
                          handleChange(idx, col.key, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                        className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        readOnly={col.readOnly}
                        min={col.min}
                        placeholder={col.label}
                      />
                    )
                  ) : (
                    <span className="text-gray-700">{row[col.key]}</span>
                  )}
                </td>
              ))}
              <td className="border-b border-gray-200 px-2 py-1 space-x-1">
                <button
                  type="button"
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                  onClick={() => addRow(idx)}
                >
                  +
                </button>
                {rows.length > 1 && (
                  <button
                    type="button"
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
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

      {/* Total Eligibility */}
      <div className="flex items-center space-x-2 text-gray-700">
        <label className="text-sm font-medium">Total Eligibility:</label>
        <span className="font-semibold text-blue-600">{totalEligibility}</span>
      </div>

      {/* Loan Amount */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-2 text-gray-700">
        <label className="text-sm font-medium mb-1 md:mb-0">Loan Amount:</label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => {
            const val = e.target.value;
            setLoanAmount(val === "" ? 0 : Number(val));
          }}
          placeholder="Enter Loan Amount"
          className="w-full md:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          min={0}
        />
      </div>

      {/* Add Loan Details Button */}
      <div className="mt-4">
        <button
          type="button"
          className="w-full md:w-auto bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition"
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
