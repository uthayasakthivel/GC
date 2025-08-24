import React, { useState } from "react";
import CustomerRegistrationForm from "../../components/CustomerRegistrationForm";
import CustomerDetailsForm from "../../components/CustomerDetailsForm";
import DynamicJewelleryTable from "../../components/DynamicJewelleryTable";
import PreviewLoanModal from "../../components/PreviewLoanModal";
import { useLoan } from "../../context/LoanContext";
import { useCustomerForm } from "../../hooks/useCustomerForm";
import { useJewelleryData } from "../../hooks/useJewelleryData";
import { useLoanSubmit } from "../../hooks/useLoanSubmit";

export default function CustomerRegistrationPage() {
  const loanContext = useLoan();
  const {
    customerData,
    setCustomerData,
    // showOtp,
    // otp,
    // otpError,
    // otpVerified,
    address,
    setAddress,
    aadharNumber,
    setAadharNumber,
    generateCustomerId,
    customerId,
    customerIdGenerated,
    loadingCustomerId,
    // setShowOtp,
    onSendOtp,
    // onOtpVerified,
    setShowJewelleryTable,
    showJewelleryTable,
    generateFormData,
  } = useCustomerForm(loanContext);

  const { jewelleryDetails, handleJewelleryChange } = useJewelleryData();
  const { handleSubmit } = useLoanSubmit(generateFormData);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="p-4 border rounded shadow">
      <CustomerRegistrationForm
        branches={loanContext.branches}
        loadingBranches={loanContext.branchesLoading}
        onSendOtp={onSendOtp}
        customerData={customerData}
        setCustomerData={setCustomerData}
        otpSent={false} // OTP section is commented out
      />

      {/* OTP section commented out */}
      {/*
      {showOtp && !otpVerified && (
        <OtpVerification
          otp={otp}
          setOtp={loanContext.setOtp}
          otpError={otpError}
          onOtpVerified={onOtpVerified}
        />
      )}
      */}

      {/*
      Customer details form will be visible immediately without OTP verification
      */}
      <CustomerDetailsForm
        address={address}
        setAddress={setAddress}
        aadharNumber={aadharNumber}
        setAadharNumber={setAadharNumber}
        generateCustomerId={generateCustomerId}
        customerIdGenerated={customerIdGenerated}
        loadingCustomerId={loadingCustomerId}
        customerId={customerId}
        setShowJewelleryTable={setShowJewelleryTable}
      />

      {showJewelleryTable && (
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
          onDataChange={handleJewelleryChange}
        />
      )}

      <button
        onClick={() => setShowPreview(true)}
        className="bg-blue-600 text-white w-full px-4 py-2 rounded mt-6"
      >
        Preview & Print
      </button>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white w-full px-4 py-2 rounded mt-2"
      >
        Submit Loan
      </button>

      {showPreview && (
        <PreviewLoanModal onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
