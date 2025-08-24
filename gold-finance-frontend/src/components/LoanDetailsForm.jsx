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
    <div className="p-4 border rounded-md space-y-4">
      <p>
        <strong>Next Loan Number:</strong> {nextLoanNumber}
      </p>

      {/* Loan Amount */}
      <div>
        <label className="block font-semibold">Loan Amount:</label>
        <input
          type="number"
          value={loanAmount}
          readOnly
          className="border px-2 py-1 rounded w-full bg-gray-100"
        />
      </div>

      {/* Loan Period */}
      <div>
        <label className="block font-semibold">Loan Period (Months):</label>
        <select
          value={loanPeriod}
          onChange={(e) => setLoanPeriod(Number(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        >
          <option value={6}>6 Months</option>
          <option value={9}>9 Months</option>
          <option value={12}>12 Months</option>
        </select>
      </div>

      {/* Interest Rate Selector */}
      <div>
        <label className="block font-semibold">Interest Rate:</label>
        <select
          onChange={(e) => {
            const selected = allInterestRates.find(
              (item) => item._id === e.target.value
            );
            if (selected) setSelectedFactor(selected.factor);
          }}
          className="border px-2 py-1 rounded w-full"
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
        <label className="block font-semibold">Loan Date:</label>
        <DatePicker
          selected={loanDate}
          onChange={(date) => setLoanDate(date)}
          dateFormat="dd/MM/yyyy"
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      {/* Loan Due Date (read-only) */}
      <div>
        <label className="block font-semibold">Loan Due Date:</label>
        <input
          type="text"
          value={dueDate ? dueDate.toLocaleDateString("en-GB") : ""}
          readOnly
          className="border px-2 py-1 rounded w-full bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* No. of Days */}
      <div>
        <label className="block font-semibold">No. of Days:</label>
        <input
          type="number"
          value={noOfDays}
          readOnly
          className="border px-2 py-1 rounded w-full bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Total Interest */}
      <div>
        <label className="block font-semibold">
          Total Interest to be Paid:
        </label>
        <input
          type="text"
          value={totalInterest}
          readOnly
          className="border px-2 py-1 rounded w-full font-bold bg-gray-100"
        />
      </div>

      {/* Always show Ref Number */}
      <div>
        <label className="block font-semibold mb-1">Ref Number:</label>
        <input
          type="text"
          value={refNumber}
          onChange={(e) => setRefNumber(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="block font-semibold mb-1">Payment Method:</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />{" "}
            Online
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="offline"
              checked={paymentMethod === "offline"}
              onChange={() => setPaymentMethod("offline")}
            />{" "}
            Offline
          </label>
        </div>
      </div>

      {/* Conditional extra input based on payment method */}
      {paymentMethod === "online" && (
        <div>
          <label className="block font-semibold mb-1">Payment by Online:</label>
          <input
            type="text"
            value={paymentByOnline}
            onChange={(e) => setPaymentByOnline(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      )}

      {paymentMethod === "offline" && (
        <div>
          <label className="block font-semibold mb-1">
            Payment by Offline:
          </label>
          <input
            type="text"
            value={paymentByOffline}
            onChange={(e) => setPaymentByOffline(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      )}

      {/* Sheet Prepared By */}
      <div>
        <label className="block font-semibold mb-1">Sheet Prepared By:</label>
        <input
          type="text"
          value={sheetPreparedBy}
          onChange={(e) => setSheetPreparedBy(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      {/* File Uploads */}
      <div className="space-y-2">
        <label className="block font-semibold mb-1">Upload Photos:</label>
        <input
          type="file"
          onChange={(e) => setCustomerPhoto(e.target.files[0])}
        />{" "}
        Customer Photo
        <input
          type="file"
          onChange={(e) => setJewelPhoto(e.target.files[0])}
        />{" "}
        Jewel Photo
        <input
          type="file"
          onChange={(e) => setAadharPhoto(e.target.files[0])}
        />{" "}
        Signed Aadhaar Photo
        <input
          type="file"
          onChange={(e) => setDeclarationPhoto(e.target.files[0])}
        />{" "}
        Self Declaration Photo
        <input
          type="file"
          onChange={(e) => setOtherPhoto(e.target.files[0])}
        />{" "}
        Others
      </div>

      {/* Generate & Preview */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleGeneratePledgeCard}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Generate Pledge Card / Receipt
        </button>
      </div>

      {/* Preview Section */}
      {previewData && (
        <div className="border p-4 mt-4">
          <h3 className="font-bold mb-2">Pledge card created</h3>
        </div>
      )}
    </div>
  );
};

export default LoanDetailsForm;
