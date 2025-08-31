// LoanContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../api/axiosInstance";
import { useNextLoanNumber } from "../hooks/useNextLoanNumber";
import { useBranchContext } from "./BranchContext";
import { useCustomerContext } from "./CustomerContext";
import { useJewellery } from "./JewelleryContext";
import { useLoanDetails } from "./LoanDetailsContext";

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  // ---- Branches ----
  // const { branches, branchesLoading, selectedBranch, setSelectedBranch } =
  //   useBranchContext();

  // ---- Customer State ----
  const {
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
    customerId,
    setCustomerId,
    customerIdGenerated,
    setCustomerIdGenerated,
    loadingCustomerId,
    setLoadingCustomerId,
    address,
    setAddress,
    aadharNumber,
    setAadharNumber,
    branches,
    selectedBranch,
    setSelectedBranch,
    branchesLoading,
    onSendOtp,
    onOtpVerified,
    generateCustomerId,
    fetchCustomerByIdOrPhone,
    populateExistingCustomer,
    resetCustomerState,
  } = useCustomerContext();

  // ---- Jewellery Config ----
  const {
    showJewelleryTable,
    setShowJewelleryTable,
    jewelleryOptions,
    setJewelleryOptions,
    selectedJewels,
    setSelectedJewels,
    eligibleAmount,
    setEligibleAmount,
    totalEligibility,
    setTotalEligibility,
    ratePerGram,
    setRatePerGram,
    configLoading,
    setConfigLoading,
    resetJewellery,
  } = useJewellery();

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
    defaultLoanDate,
    defaultLoanPeriod,
    loanPeriod,
    setLoanPeriod,
    dueDate,
    calculateDueDate,
    setDueDate,
    noOfDays,
    setNoOfDays,

    selectedFactor,
    setSelectedFactor,
    totalInterest,
    setTotalInterest,

    paymentMethod,
    setPaymentMethod,
    refNumber,
    setRefNumber,
    paymentByOnline,
    setPaymentByOnline,
    paymentByOffline,
    setPaymentByOffline,

    singleLoan,
    setSingleLoan,
    singleLoanLoading,
    setSingleLoanLoading,
    fetchSingleLoan,
    calculateDays,

    noOfDaysLoan,
    interestToPay,
    resetLoanForm,

    payInterest,
    payPrincipal,
  } = useLoanDetails();

  // Image states
  const [customerPhoto, setCustomerPhoto] = useState(null);
  const [jewelPhoto, setJewelPhoto] = useState(null);
  const [aadharPhoto, setAadharPhoto] = useState(null);
  const [declarationPhoto, setDeclarationPhoto] = useState(null);
  const [otherPhoto, setOtherPhoto] = useState(null);
  const [sheetPreparedBy, setSheetPreparedBy] = useState("");

  const [previewData, setPreviewData] = useState(null);
  console.log(previewData, "previewData");

  useEffect(() => {
    const fetchLoanInterest = async () => {
      try {
        const response = await axiosInstance.get(
          "/admin/config/interest-rates"
        );

        setAllInterestRates(response.data);

        if (response.data.length > 0)
          setSelectedInterestRate(response.data[0]._id);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchLoanInterest();
  }, []);

  // ---------- Preview ----------
  const handleGeneratePledgeCard = () => {
    // Build a clean, non-recursive preview object
    setPreviewData({
      // customer basics
      customerData, // { branch, customerName, phoneNumber }
      customerId, // string
      address, // string
      aadharNumber, // string
      selectedBranch, // {_id, name, code, ...}

      // jewellery & config
      jewelleryOptions, // string[]
      ratePerGram, // number
      showJewelleryTable, // bool
      configLoading, // bool

      // loan details
      nextLoanNumber,
      nextLoanNumberLoading,
      loanAmount,
      allInterestRates,
      selectedInterestRate,
      loanDate,
      loanPeriod,
      dueDate,
      noOfDays,
      selectedFactor,
      totalInterest,

      // payment
      paymentMethod,
      paymentByOffline,
      paymentByOnline,
      refNumber,

      // images & meta
      customerPhoto,
      jewelPhoto,
      aadharPhoto,
      declarationPhoto,
      otherPhoto,
      sheetPreparedBy,

      // branches context
      branches,
      branchesLoading,
      defaultLoanDate,
      defaultLoanPeriod,
    });
  };

  // ---------- FormData ----------
  const serializeDate = (d) =>
    d instanceof Date && !isNaN(d) ? d.toISOString() : d || "";

  const generateFormData = () => {
    const formData = new FormData();

    // Branches
    formData.append("branches", JSON.stringify(branches || []));
    formData.append("branchesLoading", String(!!branchesLoading));

    // Customer (consistent)
    formData.append("customerData", JSON.stringify(customerData || {}));
    formData.append("customerId", customerId || "");
    formData.append("address", address || "");
    formData.append("aadharNumber", aadharNumber || "");
    formData.append("selectedBranch", JSON.stringify(selectedBranch || null));

    // OTP UI (optional to send)
    formData.append("showOtp", String(!!showOtp));
    formData.append("otp", otp || "");
    formData.append("otpVerified", String(!!otpVerified));
    formData.append("otpError", otpError || "");
    formData.append("customerIdGenerated", String(!!customerIdGenerated));
    formData.append("loadingCustomerId", String(!!loadingCustomerId));

    // Jewellery Config
    formData.append("jewelleryOptions", JSON.stringify(jewelleryOptions || []));
    formData.append("showJewelleryTable", String(!!showJewelleryTable));
    formData.append("ratePerGram", String(ratePerGram ?? ""));
    formData.append("jewels", JSON.stringify(selectedJewels));
    formData.append("eligibleAmount", eligibleAmount);
    formData.append("totalEligibleAmount", totalEligibility);

    // Loan Details
    formData.append("nextLoanNumber", String(nextLoanNumber ?? ""));
    formData.append("nextLoanNumberLoading", String(!!nextLoanNumberLoading));
    formData.append("loanAmount", String(loanAmount ?? ""));
    formData.append("allInterestRates", JSON.stringify(allInterestRates || []));
    formData.append("selectedInterestRate", selectedInterestRate || "");
    formData.append("loanDate", serializeDate(loanDate));
    formData.append("loanPeriod", String(loanPeriod ?? ""));
    formData.append("dueDate", serializeDate(dueDate));
    formData.append("noOfDays", String(noOfDays ?? ""));
    formData.append("selectedFactor", String(selectedFactor ?? ""));
    formData.append("totalInterest", String(totalInterest ?? ""));
    formData.append("paymentMethod", paymentMethod || "");
    formData.append("paymentByOffline", paymentByOffline || "");
    formData.append("paymentByOnline", paymentByOnline || "");
    formData.append("refNumber", refNumber || "");
    formData.append("defaultLoanDate", serializeDate(defaultLoanDate));
    formData.append("defaultLoanPeriod", String(defaultLoanPeriod ?? ""));

    // Images
    if (customerPhoto) formData.append("customerPhoto", customerPhoto);
    if (jewelPhoto) formData.append("jewelPhoto", jewelPhoto);
    if (aadharPhoto) formData.append("aadharPhoto", aadharPhoto);
    if (declarationPhoto) formData.append("declarationPhoto", declarationPhoto);
    if (otherPhoto) formData.append("otherPhoto", otherPhoto);

    // Sheet Prepared By
    formData.append("sheetPreparedBy", sheetPreparedBy || "");

    // Preview Data snapshot
    formData.append("previewData", JSON.stringify(previewData || {}));

    return formData;
  };

  // ---------- Reset ----------

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
        selectedJewels,
        setSelectedJewels,
        eligibleAmount,
        setEligibleAmount,
        totalEligibility,
        setTotalEligibility,

        // loan
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
        paymentByOffline,
        setPaymentByOffline,
        paymentByOnline,
        setPaymentByOnline,
        refNumber,
        setRefNumber,
        defaultLoanDate,
        defaultLoanPeriod,
        calculateDueDate,
        calculateDays,

        // images/meta
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

        // preview & formdata
        previewData,
        handleGeneratePledgeCard,
        generateFormData,

        // actions
        onSendOtp,
        onOtpVerified,
        generateCustomerId,
        fetchCustomerByIdOrPhone,
        populateExistingCustomer,
        resetLoanForm,

        singleLoan,
        setSingleLoan,
        singleLoanLoading,
        setSingleLoanLoading,
        fetchSingleLoan,
        noOfDaysLoan,
        interestToPay,
        payInterest,
        payPrincipal,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => useContext(LoanContext);
