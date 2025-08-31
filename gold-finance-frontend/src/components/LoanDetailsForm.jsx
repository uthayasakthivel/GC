import { useState, useEffect } from "react";
import { useLoan } from "../context/LoanContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LoanDetailsForm = () => {
  const {
    nextLoanNumber,
    nextLoanNumberLoading,
    loanAmount,
    setLoanAmount,
    allInterestRates,
    setAllInterestRates,
    selectedInterestRate,
    setSelectedInterestRate,
    loanDate,
    setLoanDate,
    loanPeriod,
    setLoanPeriod,
    dueDate,
    setDueDate,
    noOfDays,
    setNoOfDays,
    selectedFactor,
    setSelectedFactor,
    totalInterest,
    setTotalInterest,
    paymentMethod,
    setPaymentMethod,
    setPaymentByOffline,
    paymentByOffline,
    paymentByOnline,
    setPaymentByOnline,
    refNumber,
    setRefNumber,
    defaultLoanDate,
    defaultLoanPeriod,
    calculateDueDate,
    calculateDays,
    customerPhoto,
    setCustomerPhoto,
    jewelPhoto,
    setJewelPhoto,
    aadharPhoto,
    setAadharPhoto,
    declarationPhoto,
    setDeclarationPhoto,
    otherPhoto,
    setOtherPhoto,

    sheetPreparedBy,
    setSheetPreparedBy,

    previewData,
    handleGeneratePledgeCard,
  } = useLoan();

  if (nextLoanNumberLoading) return <div>Loading...</div>;

  return (
    <div className=" rounded-xl space-y-6">
      {/* Next Loan Number */}
      <p className="text-gray-700">
        <strong>Next Loan Number:</strong> {nextLoanNumber}
      </p>

      {/* Loan Amount */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Loan Amount
        </label>
        <input
          type="number"
          value={loanAmount}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
        />
      </div>

      {/* Loan Period */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Loan Period (Months)
        </label>
        <select
          value={loanPeriod}
          onChange={(e) => setLoanPeriod(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value={6}>6 Months</option>
          <option value={9}>9 Months</option>
          <option value={12}>12 Months</option>
        </select>
      </div>

      {/* Interest Rate Selector */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Interest Rate
        </label>
        <select
          onChange={(e) => {
            const selected = allInterestRates.find(
              (item) => item._id === e.target.value
            );
            if (selected) setSelectedFactor(selected.factor);
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">Select Interest Rate</option>
          {allInterestRates.map((item) => (
            <option key={item._id} value={item._id}>
              Price: {item.price} | Percentage: {item.percentage}%
            </option>
          ))}
        </select>
      </div>

      {/* Loan Date */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Loan Date
        </label>
        <DatePicker
          selected={loanDate}
          onChange={(date) => setLoanDate(date)}
          dateFormat="dd/MM/yyyy"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Loan Due Date */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Loan Due Date
        </label>
        <input
          type="text"
          value={dueDate ? dueDate.toLocaleDateString("en-GB") : ""}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
        />
      </div>

      {/* No. of Days */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          No. of Days
        </label>
        <input
          type="number"
          value={noOfDays}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
        />
      </div>

      {/* Total Interest */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Total Interest to be Paid
        </label>
        <input
          type="text"
          value={totalInterest}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 font-semibold focus:outline-none"
        />
      </div>

      {/* Ref Number */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Ref Number
        </label>
        <input
          type="text"
          value={refNumber}
          onChange={(e) => setRefNumber(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            Online
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="paymentMethod"
              value="offline"
              checked={paymentMethod === "offline"}
              onChange={() => setPaymentMethod("offline")}
            />
            Offline
          </label>
        </div>
      </div>

      {/* Conditional Payment Inputs */}
      {paymentMethod === "online" && (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Payment by Online
          </label>
          <input
            type="text"
            value={paymentByOnline}
            onChange={(e) => setPaymentByOnline(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      )}

      {paymentMethod === "offline" && (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Payment by Offline
          </label>
          <input
            type="text"
            value={paymentByOffline}
            onChange={(e) => setPaymentByOffline(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      )}

      {/* Sheet Prepared By */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Sheet Prepared By
        </label>
        <input
          type="text"
          value={sheetPreparedBy}
          onChange={(e) => setSheetPreparedBy(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* File Uploads */}
      <div className="space-y-2">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Upload Photos
        </label>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            onChange={(e) => setCustomerPhoto(e.target.files[0])}
          />
          <input
            type="file"
            onChange={(e) => setJewelPhoto(e.target.files[0])}
          />
          <input
            type="file"
            onChange={(e) => setAadharPhoto(e.target.files[0])}
          />
          <input
            type="file"
            onChange={(e) => setDeclarationPhoto(e.target.files[0])}
          />
          <input
            type="file"
            onChange={(e) => setOtherPhoto(e.target.files[0])}
          />
        </div>
      </div>

      {/* Generate & Preview */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleGeneratePledgeCard}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Generate Pledge Card / Receipt
        </button>
      </div>

      {/* Preview Section */}
      {previewData && (
        <div className="border p-4 mt-4 rounded-lg bg-gray-50">
          <h3 className="font-bold mb-2">Pledge card created</h3>
        </div>
      )}
    </div>
  );
};

export default LoanDetailsForm;
