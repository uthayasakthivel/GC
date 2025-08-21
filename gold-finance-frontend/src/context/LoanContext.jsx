// LoanContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useBranches } from "../hooks/useBranches";
import { useNextLoanNumber } from "../hooks/useNextLoanNumber";

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  // ---- Branches ----
  const { branches, loading: branchesLoading } = useBranches();

  // ---- Customer State ----
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
  const [selectedBranch, setSelectedBranch] = useState(null);

  // ---- Jewellery Config ----
  const [showJewelleryTable, setShowJewelleryTable] = useState(false);
  const [jewelleryOptions, setJewelleryOptions] = useState([]);
  const [ratePerGram, setRatePerGram] = useState(6000);
  const [configLoading, setConfigLoading] = useState(true);

  const { nextLoanNumber, nextLoanNumberLoading } =
    useNextLoanNumber(selectedBranch);
  const [loanAmount, setLoanAmount] = useState(0);

  // ---- Fetch config on mount ----
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [jewelleryRes, rateRes] = await Promise.all([
          axiosInstance.get("/admin/config/jewellery"),
          axiosInstance.get("/admin/config/today-gold-loan-rate"),
        ]);

        setJewelleryOptions(jewelleryRes.data.map((j) => j.jewelleryName));
        setRatePerGram(rateRes.data.ratePerGram || 5000);
      } catch (err) {
        console.error("Error fetching jewellery config:", err);
      } finally {
        setConfigLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // ---- OTP ----
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

  // ---- Generate Customer ID + Register ----
  const generateCustomerId = async () => {
    if (!customerData || !customerData.branch) return;
    const branchObj = branches.find((b) => b._id === customerData.branch);
    if (!branchObj) return;

    try {
      setLoadingCustomerId(true);

      // Get next ID
      const res = await axiosInstance.get(
        `/customer/next-id?branchCode=${branchObj.code}`
      );
      const newCustomerId = res.data.customerId;
      setCustomerId(newCustomerId);

      // Save selected branch
      setSelectedBranch(branchObj);

      // Prepare payload
      const payload = {
        ...customerData,
        address,
        aadharNumber,
        branch: branchObj.name,
        branchId: customerData.branch,
        customerId: newCustomerId,
      };

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
    <LoanContext.Provider
      value={{
        // branches
        branches,
        branchesLoading,

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
        selectedBranch,
        setSelectedBranch,

        // jewellery config
        showJewelleryTable,
        setShowJewelleryTable,
        jewelleryOptions,
        ratePerGram,
        configLoading,

        // Loan
        nextLoanNumber,
        nextLoanNumberLoading,
        loanAmount,
        setLoanAmount,

        // actions
        onSendOtp,
        onOtpVerified,
        generateCustomerId,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => useContext(LoanContext);
