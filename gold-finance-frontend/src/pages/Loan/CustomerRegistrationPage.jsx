import React, { useState, useEffect } from "react";
import CustomerRegistrationForm from "../../components/CustomerRegistrationForm";
import DynamicJewelleryTable from "../../components/DynamicJewelleryTable";
import { useLoan } from "../../context/LoanContext";
import axiosInstance from "../../api/axiosInstance";
import PreviewLoanModal from "../../components/PreviewLoanModal";

export default function CustomerRegistrationPage() {
  const {
    branches,
    branchesLoading,
    selectedBranch,
    // customer
    customerData,
    setCustomerData,
    showOtp,
    setShowOtp,
    otp,
    setOtp,
    otpVerified,
    otpError,
    customerId,
    customerIdGenerated,
    loadingCustomerId,
    address,
    setAddress,
    aadharNumber,
    setAadharNumber,

    //Loan
    loanAmount,
    selectedInterestRate,
    loanDate,
    loanPeriod,

    // jewellery config
    showJewelleryTable,
    setShowJewelleryTable,
    jewelleryOptions,
    sheetPreparedBy,
    customerPhoto,
    jewelPhoto,
    aadharPhoto,
    declarationPhoto,

    // actions
    onSendOtp,
    onOtpVerified,
    generateCustomerId,
    generateFormData,
  } = useLoan();

  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    setShowPreview(true);
  };
  const isFormComplete = () => {
    return (
      customerData &&
      customerId &&
      selectedBranch &&
      aadharNumber &&
      address &&
      loanAmount > 0 &&
      selectedInterestRate &&
      loanDate &&
      loanPeriod &&
      sheetPreparedBy &&
      customerPhoto &&
      jewelPhoto &&
      aadharPhoto &&
      declarationPhoto
    );
  };

  const handleSubmit = async () => {
    try {
      const formData = generateFormData();

      // ✅ Debugging: log all key-value pairs
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      console.log("Form Data Ready", formData);

      // ✅ API call
      const response = await axiosInstance.post("/loan/create-loan", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for FormData
        },
      });

      if (response.data.success) {
        alert("Loan Submitted Successfully!");
        console.log("API Response:", response.data);
      } else {
        alert(response.data.message || "Failed to submit loan.");
      }
    } catch (error) {
      console.error("Error submitting loan:", error.response?.data || error);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <CustomerRegistrationForm
        branches={branches}
        loadingBranches={branchesLoading}
        onSendOtp={onSendOtp}
        customerData={customerData}
        setCustomerData={setCustomerData}
        otpSent={showOtp}
      />
      {/* OTP input and verify button below phone number */}
      {/* {showOtp && !otpVerified && (
        <div className="mt-4">
          <label className="block mb-1 font-semibold">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <button
            onClick={onOtpVerified}
            className="bg-red-600 text-white w-full px-4 py-2 rounded"
          >
            Verify OTP
          </button>
          {otpError && <p className="text-red-600 mt-1">{otpError}</p>}
        </div>
      )} */}
      {/* Show address, Aadhaar, Generate ID only if OTP verified */}
      {/* {otpVerified && ( */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Aadhaar Number</label>
          <input
            type="text"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          disabled={customerIdGenerated || loadingCustomerId}
          onClick={generateCustomerId}
          className="bg-purple-600 text-white w-full px-4 py-2 rounded"
        >
          {loadingCustomerId
            ? "Processing..."
            : "Generate CustomerId & Register"}
        </button>

        {customerIdGenerated && (
          <div className="font-bold text-center py-2 text-blue-700">
            Customer ID: {customerId}
          </div>
        )}

        {customerIdGenerated && (
          <button
            className="bg-gray-800 text-white w-full px-4 py-2 rounded"
            onClick={() => setShowJewelleryTable(true)}
            // onClick={handleAddJewelleryDetails} // implement later
          >
            Add Jewellery Details
          </button>
        )}
      </div>
      {/* )} */}
      {showJewelleryTable && (
        <div className="mt-4">
          <DynamicJewelleryTable
            initialRows={[]}
            columns={[
              {
                key: "ornament",
                label: "Ornaments",
                input: true,
                type: "select",
              },
              {
                key: "numItems",
                label: "No of items",
                input: true,
                type: "number",
                min: 1,
              },
              {
                key: "grossWeight",
                label: "Gross weight",
                input: true,
                type: "number",
                step: "0.01",
              },
              {
                key: "netWeight",
                label: "Net weight",
                input: true,
                type: "number",
                step: "0.01",
              },
              {
                key: "ratePerGram",
                label: "Rate per gram",
                input: true,
                type: "number",
                readOnly: true,
              },
              { key: "eligibleAmount", label: "Eligible amount", input: false },
              { key: "partial", label: "Partial", input: false },
            ]}
            onDataChange={(data) => {
              // handle jewellery details data here
              console.log("Jewellery Data:", data);
            }}
          />
        </div>
      )}

      {/* <button
        onClick={handleSubmit}
        className="bg-green-600 text-white w-full px-4 py-2 rounded mt-6"
      >
        Submit All Data
      </button> */}

      <button
        onClick={handlePreview}
        className="bg-blue-600 text-white w-full px-4 py-2 rounded mt-6"
      >
        Preview & Print
      </button>

      {showPreview && (
        <PreviewLoanModal onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
