// contexts/CustomerContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { useBranchContext } from "./BranchContext";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const { branches, setSelectedBranch } = useBranchContext();

  // Customer State
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

  // ✅ Send OTP
  const onSendOtp = useCallback(
    async (formValues) => {
      try {
        await axiosInstance.post("/customer/send-otp", {
          phoneNumber: formValues.phoneNumber,
        });

        setCustomerData({
          branch: formValues.branch,
          customerName: formValues.customerName,
          phoneNumber: formValues.phoneNumber,
        });

        setShowOtp(true);
        setOtpVerified(false);
        setOtp("");
        setOtpError("");
        setCustomerId("");
        setCustomerIdGenerated(false);
        setAddress("");
        setAadharNumber("");
        setSelectedBranch(null);
      } catch (err) {
        alert("Failed to send OTP. Please try again.");
        console.error(err);
      }
    },
    [setSelectedBranch]
  );

  // ✅ Verify OTP
  const onOtpVerified = useCallback(async () => {
    try {
      await axiosInstance.post("/customer/verify-otp", {
        phoneNumber: customerData?.phoneNumber,
        otp,
      });
      setOtpError("");
      setOtpVerified(true);
    } catch (err) {
      setOtpVerified(false);
      setOtpError("OTP not verified");
    }
  }, [customerData, otp]);

  // ✅ Generate Customer ID
  const generateCustomerId = useCallback(async () => {
    if (!customerData || !customerData.branch) return;
    const branchObj = branches.find((b) => b._id === customerData.branch);
    if (!branchObj) return;

    try {
      setLoadingCustomerId(true);
      const res = await axiosInstance.get(
        `/customer/next-id?branchCode=${branchObj.code}`
      );
      const newCustomerId = res?.data?.customerId;
      if (!newCustomerId) throw new Error("Failed to get new customer ID");

      setCustomerId(newCustomerId);
      setSelectedBranch(branchObj);

      const payload = {
        customerName: customerData.customerName,
        phoneNumber: customerData.phoneNumber,
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
  }, [customerData, branches, address, aadharNumber, setSelectedBranch]);

  // ✅ Search customer by ID or phone
  const fetchCustomerByIdOrPhone = useCallback(async (inputValue) => {
    try {
      const { data } = await axiosInstance.get(
        `/customer/search/${inputValue}`
      );
      const customer = data?.customer || data;
      if (customer) {
        populateExistingCustomer(customer);
        return customer;
      }
      return null;
    } catch (error) {
      console.error("Error fetching customer:", error?.response?.data || error);
      return null;
    }
  }, []);

  // ✅ Normalize and populate existing customer
  const populateExistingCustomer = useCallback(
    (customer) => {
      if (!customer) return;

      setCustomerData({
        branch: customer.branchId,
        customerName: customer.customerName,
        phoneNumber: customer.phoneNumber,
      });

      setCustomerId(customer.customerId || "");
      setAddress(customer.address || "");
      setAadharNumber(customer.aadharNumber || "");

      const branchObj =
        branches.find((b) => b._id === customer.branchId) || null;
      setSelectedBranch(branchObj);

      setOtpVerified(false);
      setShowOtp(false);
      setOtp("");
      setCustomerIdGenerated(true);
    },
    [branches, setSelectedBranch]
  );

  return (
    <CustomerContext.Provider
      value={{
        customerData,
        setCustomerData,
        showOtp,
        setShowOtp,
        otp,
        setOtp,
        otpVerified,
        setOtpVerified,
        otpError,
        setOtpError,
        setOtpError,
        setCustomerId,
        setCustomerIdGenerated,
        setLoadingCustomerId,
        customerId,
        customerIdGenerated,
        loadingCustomerId,
        address,
        setAddress,
        aadharNumber,
        setAadharNumber,
        onSendOtp,
        onOtpVerified,
        generateCustomerId,
        fetchCustomerByIdOrPhone,
        populateExistingCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => useContext(CustomerContext);
