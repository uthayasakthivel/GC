import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PayTabs from "./PayTabs";
import CustomerDetails from "./CustomerDetails";
import LoanDetailSection from "./LoanDetailSection";
import { useLoan } from "../../context/LoanContext";
import axiosInstance from "../../api/axiosInstance";
import LoanDetailsActions from "./LoanDetailsActions";
import { usePreviewContext } from "../../context/PreviewContext";
import PreviewModal from "../../components/PreviewLoanModal";

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

  const { handleGeneratePledgeCard } = usePreviewContext(); // ← Add here
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleGenerateExistingLoanPledge = () => {
    if (!singleLoan || singleLoan.status === "loanclosed") return;

    handleGeneratePledgeCard({
      customerData: singleLoan.customer,
      customerId: singleLoan.customer?._id,
      address: singleLoan.customer?.address,
      aadharNumber: singleLoan.customer?.aadharNumber,
      selectedBranch: singleLoan.selectedBranch,
      jewelleryOptions: singleLoan.jewels,
      ratePerGram: singleLoan.ratePerGram,
      showJewelleryTable: true,
      configLoading: false,
      nextLoanNumber: singleLoan.loanNumber,
      nextLoanNumberLoading: false,
      loanAmount: singleLoan.loanAmount,
      allInterestRates: [],
      selectedInterestRate: singleLoan.interestRate,
      loanDate: singleLoan.loanDate,
      loanPeriod: singleLoan.loanPeriod,
      dueDate: singleLoan.dueDate,
      noOfDays: singleLoan.noOfDays,
      selectedFactor: singleLoan.factor,
      totalInterest: singleLoan.totalInterest,
      paymentMethod: singleLoan.paymentMethod,
      paymentByOffline: singleLoan.paymentByOffline,
      paymentByOnline: singleLoan.paymentByOnline,
      refNumber: singleLoan.refNumber,
      customerPhoto: singleLoan.customerPhoto,
      jewelPhoto: singleLoan.jewelPhoto,
      aadharPhoto: singleLoan.aadharPhoto,
      declarationPhoto: singleLoan.declarationPhoto,
      otherPhoto: singleLoan.otherPhoto,
      sheetPreparedBy: singleLoan.sheetPreparedBy,
      branches: [],
      branchesLoading: false,
      defaultLoanDate: new Date(),
      defaultLoanPeriod: 6,
    });
    setShowPreviewModal(true);
  };

  const [releaseRows, setReleaseRows] = useState([]); // multi-jewel selection
  const [partPaymentAmount, setPartPaymentAmount] = useState(0);

  const hidePayTabs = singleLoan?.status === "loanclosed";

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

  const jewelsToShow = useMemo(() => {
    if (!jewels.length) return [];

    if (isPrincipalClosed) return jewels;
    if (isPartialClosed) return jewels.filter((j) => j.released);

    return jewels.filter((j) => !j.released);
  }, [jewels, isPrincipalClosed, isPartialClosed]);

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
    if (!releaseRows.length) return;
    const totalDue =
      releaseRows.reduce((sum, j) => sum + (Number(j.partial) || 0), 0) +
      parseFloat(interestToPay || 0);

    if (Math.abs(partPaymentAmount - totalDue) > 0.01) {
      alert(`Please enter the exact amount: ₹${totalDue.toFixed(2)}`);
      return;
    }

    try {
      const payload = {
        partialJewelOrnaments: releaseRows.map((j) => j.ornament),
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
        setReleaseRows([]);
        setPartPaymentAmount(0);
      }
    } catch (err) {
      console.error("Error processing partial payment:", err);
      alert("Failed to process partial payment");
    }
  };

  const handleCloseLoan = async () => {
    try {
      const response = await axiosInstance.patch(
        `/loan/${singleLoan._id}/pay-principal`,
        { paidDate: new Date().toISOString(), newLoanAmount: 0 }
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
            ? "This loan was partially released. Only released jewel details are visible."
            : "Loan Closed by Principal Payment"}
        </div>
      )}

      <div className="mb-4 flex gap-2">
        <LoanDetailsActions
          loan={singleLoan}
          onShowPreview={setShowPreviewModal}
        />
      </div>

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
              <th className="border p-2 text-left">No. of Items</th>
              <th className="border p-2 text-left">Gross Weight</th>
              <th className="border p-2 text-left">Net Weight</th>
              <th className="border p-2 text-left">Rate/Gram</th>
              <th className="border p-2 text-left">Eligible Amount</th>
              <th className="border p-2 text-left">Partial Amount</th>
              {!(isPrincipalClosed || isPartialClosed) && (
                <th className="border p-2 text-left">Release</th>
              )}
              <th className="border p-2 text-left">Released Date</th>
            </tr>
          </thead>
          <tbody>
            {jewelsToShow.map((row) => (
              <tr key={row.ornament}>
                <td>{row.ornament}</td>
                <td>{row.numItems}</td>
                <td>{row.grossWeight}</td>
                <td>{row.netWeight}</td>
                <td>{row.ratePerGram}</td>
                <td>{row.eligibleAmount}</td>
                <td>{row.partial}</td>
                {!(isPrincipalClosed || isPartialClosed) && (
                  <td>
                    <input
                      type="checkbox"
                      checked={releaseRows.includes(row)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setReleaseRows((prev) => [...prev, row]);
                        else
                          setReleaseRows((prev) =>
                            prev.filter((j) => j.ornament !== row.ornament)
                          );
                      }}
                    />
                  </td>
                )}
                <td>
                  {row.releasedDate
                    ? new Date(row.releasedDate).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Partial Release Section */}
      {releaseRows.length > 0 && !(isPrincipalClosed || isPartialClosed) && (
        <div className="border p-4 rounded shadow mb-4 bg-gray-50">
          <h3 className="text-lg font-bold mb-2">Partial Release</h3>
          <p>
            <strong>Jewels Selected:</strong>{" "}
            {releaseRows.map((j) => j.ornament).join(", ")}
          </p>
          <div className="mt-2">
            <label className="block font-medium mb-1">Total Amount</label>
            <input
              type="number"
              value={partPaymentAmount}
              onChange={(e) => setPartPaymentAmount(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              Exact Amount to Enter: ₹
              {releaseRows.reduce(
                (sum, j) => sum + (Number(j.partial) || 0),
                0
              ) + interestToPay}
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

      {!isPrincipalClosed &&
        !isPartialClosed &&
        Number(partPaymentAmount) === singleLoan.loanAmount && (
          <div className="mb-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={handleCloseLoan}
            >
              Close Loan
            </button>
          </div>
        )}

      {!hidePayTabs && (
        <PayTabs loan={singleLoan} isPrincipalClosed={isPrincipalClosed} />
      )}

      {showPreviewModal && (
        <PreviewModal onClose={() => setShowPreviewModal(false)} />
      )}
    </div>
  );
}
