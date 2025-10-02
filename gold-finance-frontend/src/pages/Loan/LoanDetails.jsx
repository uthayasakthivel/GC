import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PayTabs from "./PayTabs";
import CustomerDetails from "./CustomerDetails";
import LoanDetailSection from "./LoanDetailSection";
import { useLoan } from "../../context/LoanContext";
import axiosInstance from "../../api/axiosInstance";

export default function LoanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    singleLoan,
    setSingleLoan,
    singleLoanLoading,
    fetchSingleLoan,
    interestToPay,
    setLoanAmount,
    setEligibleAmount,
  } = useLoan();

  const [releaseRow, setReleaseRow] = useState(null);
  const [partPaymentAmount, setPartPaymentAmount] = useState(0);

  const hidePayTabs = singleLoan?.status === "loanclosed";

  // Load loan on id change
  useEffect(() => {
    if (id) fetchSingleLoan(id);
  }, [id, fetchSingleLoan]);

  const jewels = singleLoan?.jewels || [];
  const isPrincipalClosed =
    singleLoan?.status === "loanclosed" &&
    singleLoan.closureType !== "partialRelease";
  const isPartialClosed =
    singleLoan?.status === "loanclosed" &&
    singleLoan.closureType === "partialRelease";

  // Decide which jewels to show
  const jewelsToShow = useMemo(() => {
    if (!jewels.length) return [];

    if (isPrincipalClosed) return jewels; // show all jewels
    if (isPartialClosed) return jewels.filter((j) => j.released); // show only released jewel(s)

    // New/active loan (after partial release) → show only remaining/unreleased jewels
    return jewels.filter((j) => !j.released);
  }, [jewels, isPrincipalClosed, isPartialClosed]);

  // Update totals
  useEffect(() => {
    const loanAmountSum = jewelsToShow.reduce(
      (sum, j) => sum + (Number(j.partial) || Number(j.eligibleAmount) || 0),
      0
    );
    const eligibleAmountSum = jewelsToShow.reduce(
      (sum, j) => sum + (Number(j.eligibleAmount) || 0),
      0
    );
    setLoanAmount(loanAmountSum);
    setEligibleAmount(eligibleAmountSum);
  }, [jewelsToShow, setLoanAmount, setEligibleAmount]);

  // ---------------- Handle Partial Payment ----------------
  const handlePayPartial = async () => {
    if (!releaseRow) return;
    const totalDue =
      parseFloat(releaseRow.partial || 0) + parseFloat(interestToPay || 0);
    const enteredAmount = parseFloat(partPaymentAmount);

    if (Math.abs(enteredAmount - totalDue) > 0.01) {
      alert(`Please enter the exact amount: ₹${totalDue.toFixed(2)}`);
      return;
    }

    try {
      const payload = {
        partialJewelOrnament: releaseRow.ornament,
        paidDate: new Date().toISOString(),
      };
      const response = await axiosInstance.patch(
        `/loan/${singleLoan._id}/pay-partial`,
        payload
      );
      if (response.data.success) {
        alert("Partial payment processed successfully. New loan created!");
        const newLoanId = response.data.newLoan?._id;
        if (newLoanId) navigate(`/loan/${newLoanId}`);
        else fetchSingleLoan(singleLoan._id);
        setReleaseRow(null);
        setPartPaymentAmount(0);
      }
    } catch (err) {
      console.error("Error processing partial payment:", err);
      alert("Failed to process partial payment");
    }
  };

  // ---------------- Handle Full Principal Payment ----------------
  const handleCloseLoan = async () => {
    try {
      const response = await axiosInstance.patch(
        `/loan/${singleLoan._id}/pay-principal`,
        {
          paidDate: new Date().toISOString(),
          newLoanAmount: 0, // full payment
        }
      );
      if (response.data.success) {
        alert("Loan closed by full principal payment!");
        fetchSingleLoan(singleLoan._id);
        setPartPaymentAmount(0);
      }
    } catch (err) {
      console.error("Error closing loan:", err);
      alert("Failed to close loan");
    }
  };

  if (singleLoanLoading) return <p>Loading loan details…</p>;
  if (!singleLoan) return <p>No loan found.</p>;

  return (
    <div className="p-4 bg-white shadow rounded">
      {/* ---------------- Loan Closure Badge ---------------- */}
      {(isPrincipalClosed || isPartialClosed) && (
        <div className="mb-4 p-2 bg-yellow-300 text-yellow-900 font-semibold rounded text-center">
          {isPartialClosed
            ? "Partial Released – This Loan is Closed"
            : "Loan Closed by Principal Payment"}
        </div>
      )}

      {/* Customer + Loan Details */}
      <CustomerDetails />
      <LoanDetailSection />

      {/* Jewellery Table */}
      <div className="border rounded-lg p-4 bg-white shadow mb-4">
        <h2 className="text-lg font-semibold mb-4">
          {isPrincipalClosed
            ? "Jewellery Details"
            : isPartialClosed
            ? "Released Jewellery Details"
            : "Jewellery Details"}
        </h2>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Ornament</th>
              {isPrincipalClosed ? (
                <>
                  <th className="border p-2 text-left">Net Weight</th>
                  <th className="border p-2 text-left">Loan Amount</th>
                </>
              ) : (
                <>
                  <th className="border p-2 text-left">No. of Items</th>
                  <th className="border p-2 text-left">Gross Weight</th>
                  <th className="border p-2 text-left">Net Weight</th>
                  <th className="border p-2 text-left">Rate/Gram</th>
                  <th className="border p-2 text-left">Eligible Amount</th>
                  <th className="border p-2 text-left">Partial Amount</th>
                  {!isPartialClosed && (
                    <th className="border p-2 text-left">Release</th>
                  )}
                  {!isPartialClosed && (
                    <th className="border p-2 text-left">Released Date</th>
                  )}
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {jewelsToShow.map((row, idx) => (
              <tr key={idx}>
                <td>{row.ornament}</td>
                {isPrincipalClosed ? (
                  <>
                    <td>{row.netWeight}</td>
                    <td>{row.partial || row.eligibleAmount}</td>
                  </>
                ) : (
                  <>
                    <td>{row.numItems}</td>
                    <td>{row.grossWeight}</td>
                    <td>{row.netWeight}</td>
                    <td>{row.ratePerGram}</td>
                    <td>{row.eligibleAmount}</td>
                    <td>{row.partial}</td>
                    {!isPartialClosed && (
                      <td>
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                          onClick={() => setReleaseRow(row)}
                        >
                          Release Partial
                        </button>
                      </td>
                    )}
                    {!isPartialClosed && (
                      <td>
                        {row.releasedDate
                          ? new Date(row.releasedDate).toLocaleString()
                          : "-"}
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Partial Release Section */}
      {releaseRow && !isPrincipalClosed && !isPartialClosed && (
        <div className="border p-4 rounded shadow mb-4 bg-gray-50">
          <h3 className="text-lg font-bold mb-2">Partial Release</h3>
          <p>
            <strong>Ornament:</strong> {releaseRow.ornament}
          </p>
          <p>
            <strong>Eligible Amount:</strong> {releaseRow.eligibleAmount}
          </p>
          <div className="mt-2">
            <label className="block font-medium mb-1">Partial Amount</label>
            <input
              type="number"
              value={partPaymentAmount}
              onChange={(e) => setPartPaymentAmount(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              Exact Amount to Enter: ₹
              {Number(releaseRow.partial || 0) + interestToPay}
            </p>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            onClick={handlePayPartial}
          >
            Pay Partial & Create New Loan
          </button>
        </div>
      )}

      {/* Close Loan Button for Full Principal */}
      {!isPrincipalClosed &&
        Number(partPaymentAmount) === singleLoan.loanAmount &&
        singleLoan.status !== "loanclosed" && (
          <div className="mb-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={handleCloseLoan}
            >
              Close Loan
            </button>
          </div>
        )}

      {/* PayTabs always rendered, internally hidden for principal-closed loans */}
      {!hidePayTabs && (
        <PayTabs loan={singleLoan} isPrincipalClosed={isPrincipalClosed} />
      )}
    </div>
  );
}
