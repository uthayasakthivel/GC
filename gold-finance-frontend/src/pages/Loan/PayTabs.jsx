import React, { useState } from "react";
import { useLoan } from "../../context/LoanContext";
import TopupTab from "./TopupTab";
import { useJewellery } from "../../context/JewelleryContext";

export default function PayTabs({ loan, isPrincipalClosed }) {
  // Hooks are always called
  const [activeTab, setActiveTab] = useState("interest");
  const {
    interestToPay,
    singleLoan,
    payInterest,
    noOfDaysLoan,
    setLoanAmount,
    setSingleLoan,
    payPrincipal,
  } = useLoan();
  const { ratePerGram } = useJewellery();

  const [paidDate, setPaidDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [partPaymentPrincipal, setPartPaymentPrincipal] = useState(0);
  const [partPaymentDate, setPartPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Hide content if fully principal-closed
  if (isPrincipalClosed) return null;

  const handlePayInterest = async () => {
    if (singleLoan?._id) {
      await payInterest(singleLoan._id, paidDate);
      alert("Interest Paid Successfully!");
    }
  };

  const handleSubmitPrincipalPayment = async () => {
    if (partPaymentPrincipal < interestToPay) {
      alert(
        "Part payment must be greater than or equal to interest amount due"
      );
      return;
    }

    const outstandingPrincipal =
      loan.loanAmount - (partPaymentPrincipal - interestToPay);

    try {
      const updatedLoan = await payPrincipal(
        loan._id,
        partPaymentDate,
        outstandingPrincipal,
        outstandingPrincipal <= 0 ? "loanclosed" : "loanopen"
      );

      if (updatedLoan) {
        alert("Principal Payment Successful!");
        setPartPaymentPrincipal(0);
        setPartPaymentDate(new Date().toISOString().slice(0, 10));
      }
    } catch (error) {
      console.error("Error paying principal:", error);
      alert("Error processing principal payment");
    }
  };

  return (
    <div className="border rounded-lg shadow p-4">
      {/* Tabs Header */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "interest"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("interest")}
        >
          Pay Interest
        </button>
        <button
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "principal"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("principal")}
        >
          Pay Principal
        </button>
        <button
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "topup"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("topup")}
        >
          Topup
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "interest" && (
          <div>
            <h3 className="text-lg font-bold mb-2">Pay Interest</h3>
            <p>
              <strong>Name:</strong> {loan.customerData.customerName}
            </p>
            <p>
              <strong>Customer ID:</strong> {loan.customerId}
            </p>
            <p>
              <strong>Loan ID:</strong> {loan.loanId}
            </p>
            <p>
              <strong>Loan Amount:</strong> ₹{loan.loanAmount}
            </p>
            <p>
              <strong>Interest Amount:</strong> ₹{interestToPay.toFixed(2)}
            </p>
            <p>
              <strong>Interest Paid On:</strong>{" "}
              {singleLoan?.lastInterestPaidDate
                ? new Date(singleLoan.lastInterestPaidDate).toLocaleDateString(
                    "en-GB"
                  )
                : "Not paid yet"}
            </p>

            <div className="mt-2">
              <label className="block font-semibold">Payment Date:</label>
              <input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              onClick={handlePayInterest}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Pay Interest
            </button>
          </div>
        )}

        {activeTab === "principal" && (
          <div>
            <h3 className="text-lg font-bold mb-2">Pay Principal</h3>
            <p>
              <strong>Name:</strong> {loan.customerData.customerName}
            </p>
            <p>
              <strong>Customer ID:</strong> {loan.customerId}
            </p>
            <p>
              <strong>Loan ID:</strong> {loan.loanId}
            </p>
            <p>
              <strong>Loan Amount:</strong> ₹{loan.loanAmount}
            </p>
            <p>
              <strong>Last Interest Paid On:</strong>{" "}
              {singleLoan?.lastInterestPaidDate
                ? new Date(singleLoan.lastInterestPaidDate).toLocaleDateString(
                    "en-GB"
                  )
                : "Not paid yet"}
            </p>
            <p>
              <strong>Interest Amount Due:</strong> ₹{interestToPay.toFixed(2)}
            </p>
            <p>
              <strong>No of Days:</strong> {noOfDaysLoan}
            </p>

            <div className="mt-4">
              <label className="block font-medium mb-1">
                Part Payment Amount
              </label>
              <input
                type="number"
                min="0"
                value={partPaymentPrincipal}
                onChange={(e) =>
                  setPartPaymentPrincipal(Number(e.target.value))
                }
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mt-2">
              <label className="block font-medium mb-1">Payment Date</label>
              <input
                type="date"
                value={partPaymentDate}
                onChange={(e) => setPartPaymentDate(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>

            <p className="mt-2">
              <strong>Outstanding Interest:</strong>{" "}
              {partPaymentPrincipal > interestToPay
                ? 0
                : interestToPay.toFixed(2)}
            </p>

            {partPaymentPrincipal < interestToPay && (
              <p className="text-red-600 mt-1">
                Part payment must be greater than or equal to interest amount to
                pay interest
              </p>
            )}

            <button
              className={`mt-4 px-4 py-2 text-white rounded ${
                partPaymentPrincipal === loan.loanAmount
                  ? "bg-red-600"
                  : "bg-green-600"
              }`}
              disabled={partPaymentPrincipal < interestToPay}
              onClick={handleSubmitPrincipalPayment}
            >
              {partPaymentPrincipal === loan.loanAmount
                ? "Close Loan"
                : "Submit Principal Payment"}
            </button>
          </div>
        )}

        {activeTab === "topup" && (
          <TopupTab loan={loan} currentRatePerGram={ratePerGram} />
        )}
      </div>
    </div>
  );
}
