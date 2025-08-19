// import React, { useState } from "react";
// import CustomerRegistrationForm from "../../components/CustomerRegistrationForm";
// import OtpDialog from "../../components/OtpDialog";
// import axiosInstance from "../../api/axiosInstance";
// import { useBranches } from "../../hooks/useBranches";

// export default function CustomerRegistrationPage() {
//   const { branches, loading } = useBranches();
//   const [showOtp, setShowOtp] = useState(false);
//   const [customerData, setCustomerData] = useState(null);

//   // Called when user submits the registration form to send OTP
//   const onSendOtp = async (formValues) => {
//     try {
//       await axiosInstance.post("/customer/send-otp", {
//         phoneNumber: formValues.phoneNumber,
//       });
//       setCustomerData(formValues);
//       setShowOtp(true);
//     } catch (err) {
//       alert("Failed to send OTP. Please try again.");
//       console.error(err);
//     }
//   };

//   // Called after OTP is verified
//   const onOtpVerified = async (otp) => {
//     try {
//       await axiosInstance.post("/customer/verify-otp", {
//         phoneNumber: customerData.phoneNumber,
//         otp,
//       });

//       // Find branch name by branchId
//       const selectedBranch = branches.find(
//         (b) => b._id === customerData.branch
//       );

//       await axiosInstance.post("/customer/register", {
//         ...customerData,
//         phoneNumber: customerData.phoneNumber.startsWith("+91")
//           ? customerData.phoneNumber
//           : "+91" + customerData.phoneNumber.replace(/^0+/, ""),
//         branch: selectedBranch ? selectedBranch.name : "",
//         branchId: customerData.branch,
//       });

//       alert("Registration successful!");
//       setShowOtp(false);
//       setCustomerData(null);
//     } catch (err) {
//       alert("OTP verification or registration failed. Please try again.");
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       <CustomerRegistrationForm
//         branches={branches}
//         loadingBranches={loading}
//         onSendOtp={onSendOtp}
//       />
//       {showOtp && customerData && (
//         <OtpDialog
//           phoneNumber={customerData.phoneNumber}
//           onVerified={onOtpVerified}
//           onClose={() => setShowOtp(false)}
//         />
//       )}
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import CustomerRegistrationForm from "../../components/CustomerRegistrationForm";
import axiosInstance from "../../api/axiosInstance";
import { useBranches } from "../../hooks/useBranches";

export default function CustomerRegistrationPage() {
  const { branches, loading } = useBranches();

  const [customerData, setCustomerData] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerIdGenerated, setCustomerIdGenerated] = useState(false);
  const [loadingCustomerId, setLoadingCustomerId] = useState(false);
  const [address, setAddress] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");

  // Send OTP
  const onSendOtp = async (formValues) => {
    try {
      await axiosInstance.post("/customer/send-otp", {
        phoneNumber: formValues.phoneNumber,
      });
      setCustomerData(formValues);
      setShowOtp(true);
      setOtpVerified(false);
      setOtp("");
      setOtpError("");
      setCustomerId("");
      setCustomerIdGenerated(false);
      setAddress("");
      setAadharNumber("");
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
      console.error(err);
    }
  };

  // Verify OTP
  const onOtpVerified = async () => {
    try {
      await axiosInstance.post("/customer/verify-otp", {
        phoneNumber: customerData.phoneNumber,
        otp,
      });
      setOtpError("");
      setOtpVerified(true);
    } catch (err) {
      setOtpVerified(false);
      setOtpError("OTP not verified");
    }
  };

  // Generate Customer ID based on branch code and create customer record
  const generateCustomerId = async () => {
    if (!customerData || !customerData.branch) return;
    const selectedBranch = branches.find((b) => b._id === customerData.branch);
    if (!selectedBranch) return;

    try {
      setLoadingCustomerId(true);
      // Get next ID
      const res = await axiosInstance.get(
        `/customer/next-id?branchCode=${selectedBranch.code}`
      );
      const newCustomerId = res.data.customerId;
      setCustomerId(newCustomerId);

      // Prepare payload with full data including generated customerId, address and aadharNumber
      const payload = {
        ...customerData,
        address,
        aadharNumber,
        branch: selectedBranch.name,
        branchId: customerData.branch,
        customerId: newCustomerId,
      };

      // Create customer record
      await axiosInstance.post("/customer/register", payload);

      setCustomerIdGenerated(true);
      alert("Customer registered successfully!");
    } catch (err) {
      alert("Failed to generate Customer ID or register customer. Try again.");
      console.error(err);
    } finally {
      setLoadingCustomerId(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <CustomerRegistrationForm
        branches={branches}
        loadingBranches={loading}
        onSendOtp={onSendOtp}
        customerData={customerData}
        setCustomerData={setCustomerData}
        otpSent={showOtp}
      />

      {/* OTP input and verify button below phone number */}
      {showOtp && !otpVerified && (
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
      )}

      {/* Show address, Aadhaar, Generate ID only if OTP verified */}
      {otpVerified && (
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
              // onClick={handleAddJewelleryDetails} // implement later
            >
              Add Jewellery Details
            </button>
          )}
        </div>
      )}
    </div>
  );
}
