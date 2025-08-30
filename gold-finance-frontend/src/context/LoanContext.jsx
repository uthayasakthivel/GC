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

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  // ---- Branches ----
  const { branches, branchesLoading, selectedBranch, setSelectedBranch } =
    useBranchContext();
  const {
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
    onSendOtp,
    onOtpVerified,
    setOtpVerified,
    setOtpError,
    setCustomerId,
    setCustomerIdGenerated,
    setLoadingCustomerId,
    generateCustomerId,
    fetchCustomerByIdOrPhone,
    populateExistingCustomer,
  } = useCustomerContext();
  // ---- Customer State ----

  // ---- Jewellery Config ----

  const [showJewelleryTable, setShowJewelleryTable] = useState(false);
  const [jewelleryOptions, setJewelleryOptions] = useState([]);

  const [selectedJewels, setSelectedJewels] = useState([]);
  const [eligibleAmount, setEligibleAmount] = useState(0);

  const [totalEligibility, setTotalEligibility] = useState(0);

  const [ratePerGram, setRatePerGram] = useState(6000);
  const [configLoading, setConfigLoading] = useState(true);

  // ---- Loan Numbers (depends on selectedBranch object) ----
  const { nextLoanNumber, nextLoanNumberLoading } =
    useNextLoanNumber(selectedBranch);

  // ---- Loan core fields ----
  const [loanAmount, setLoanAmount] = useState(0);
  const [allInterestRates, setAllInterestRates] = useState([]);
  const [selectedInterestRate, setSelectedInterestRate] = useState("");

  // Dates
  const defaultLoanDate = new Date();
  const defaultLoanPeriod = 6; // months
  const [loanDate, setLoanDate] = useState(defaultLoanDate);
  const [loanPeriod, setLoanPeriod] = useState(defaultLoanPeriod);
  const [singleLoan, setSingleLoan] = useState(null);
  const [singelLoanLoading, setSingelLoanLoading] = useState(true);

  // ✅ Helper: Calculate due date
  const calculateDueDate = (date, period) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + period);
    d.setDate(d.getDate() - 1); // subtract 1 day correctly
    return d;
  };

  // ✅ Helper: Calculate days difference
  const calculateDays = (start, end) => {
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const [dueDate, setDueDate] = useState(() =>
    calculateDueDate(defaultLoanDate, defaultLoanPeriod)
  );
  const [noOfDays, setNoOfDays] = useState(() =>
    calculateDays(
      defaultLoanDate,
      calculateDueDate(defaultLoanDate, defaultLoanPeriod)
    )
  );

  const fetchSingleLoan = async (id) => {
    try {
      const res = await axiosInstance.get(`/loan/${id}`);
      if (res.data.success) {
        setSingleLoan(res.data.loan);
      }
    } catch (error) {
      console.error("Failed to fetch singleLoan details", error);
    } finally {
      setSingelLoanLoading(false);
    }
  };

  // ✅ Calculate loan days difference (allow 0)
  const calculateLoanDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // normalize to midnight for full-day difference
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    const diffTime = to.getTime() - from.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // can be 0
  };

  // ✅ Derived calculation
  const noOfDaysLoan = singleLoan
    ? singleLoan.lastInterestPaidDate
      ? calculateLoanDays(singleLoan.lastInterestPaidDate, new Date())
      : calculateLoanDays(singleLoan.loanDate, new Date())
    : 0;

  const interestToPay =
    singleLoan && singleLoan.selectedFactor && singleLoan.loanAmount
      ? noOfDaysLoan * singleLoan.selectedFactor * singleLoan.loanAmount
      : 0;

  const payInterestAPI = async (id, paidDate) => {
    try {
      const res = await axiosInstance.patch(`/loan/${id}/pay-interest`, {
        paidDate,
      });
      return res.data;
    } catch (error) {
      console.error("Error in payInterestAPI:", error);
      throw error;
    }
  };

  // API call
  const payPrincipalAPI = async (id, paidDate, newLoanAmount) => {
    try {
      const res = await axiosInstance.patch(`/loan/${id}/pay-principal`, {
        paidDate,
        newLoanAmount,
      });
      return res.data;
    } catch (error) {
      console.error("Error in payPrincipalAPI:", error);
      throw error;
    }
  };

  const payInterest = useCallback(async (id, paidDate) => {
    try {
      const data = await payInterestAPI(id, paidDate);
      if (data.success) {
        setSingleLoan(data.loan);
      }
    } catch (error) {
      console.error("Error paying interest:", error);
    }
  }, []);

  // ✅ Hook to call payPrincipal API
  const payPrincipal = useCallback(
    async (id, paidDate, newLoanAmount, status) => {
      try {
        const data = await payPrincipalAPI(id, paidDate, newLoanAmount, status);
        if (data.success) {
          setSingleLoan(data.loan); // ✅ Update local state
        }
      } catch (error) {
        console.error("Error paying principal:", error);
      }
    },
    []
  );

  const [selectedFactor, setSelectedFactor] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("offline");
  const [refNumber, setRefNumber] = useState("");
  const [paymentByOnline, setPaymentByOnline] = useState("");
  const [paymentByOffline, setPaymentByOffline] = useState("");

  // Jewel States

  // Image states
  const [customerPhoto, setCustomerPhoto] = useState(null);
  const [jewelPhoto, setJewelPhoto] = useState(null);
  const [aadharPhoto, setAadharPhoto] = useState(null);
  const [declarationPhoto, setDeclarationPhoto] = useState(null);
  const [otherPhoto, setOtherPhoto] = useState(null);
  const [sheetPreparedBy, setSheetPreparedBy] = useState("");

  const [previewData, setPreviewData] = useState(null);
  console.log(previewData, "previewData");

  // ---------- Derived calculations ----------
  // Update due date & noOfDays whenever loanDate or loanPeriod changes
  useEffect(() => {
    const newDueDate = calculateDueDate(loanDate, loanPeriod);
    setDueDate(newDueDate);
    setNoOfDays(calculateDays(loanDate, newDueDate) + 1);
  }, [loanDate, loanPeriod]);

  // Calculate total interest whenever inputs change
  useEffect(() => {
    if (noOfDays && loanAmount && selectedFactor) {
      const interest = noOfDays * loanAmount * selectedFactor;
      setTotalInterest(
        Number.isFinite(interest) ? interest.toFixed(2) : "0.00"
      );
    } else {
      setTotalInterest("0.00");
    }
  }, [noOfDays, loanAmount, selectedFactor]);

  // ---------- Config fetch ----------
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [jewelleryRes, rateRes] = await Promise.all([
          axiosInstance.get("/admin/config/jewellery"),
          axiosInstance.get("/admin/config/today-gold-loan-rate"),
        ]);

        setJewelleryOptions(
          Array.isArray(jewelleryRes.data)
            ? jewelleryRes.data.map((j) => j.jewelleryName)
            : []
        );
        setRatePerGram(rateRes?.data?.ratePerGram ?? 5000);
      } catch (err) {
        console.error("Error fetching jewellery config:", err);
      } finally {
        setConfigLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Fetch Loan Interest Rates

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

  // ---------- Register New Customer & Generate Customer ID ----------

  // ---------- Search existing customer ----------

  // ---------- Normalize existing customer to SAME pattern ----------

  // ---------- Keep selectedBranch in sync when branches or customerData change ----------
  useEffect(() => {
    if (customerData?.branch && branches.length) {
      const branchObj =
        branches.find((b) => b._id === customerData.branch) || null;
      setSelectedBranch(branchObj);
    }
  }, [customerData?.branch, branches]);

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
  const resetLoanForm = () => {
    setCustomerData(null);
    setShowOtp(false);
    setOtp("");
    setOtpVerified(false);
    setOtpError("");
    setCustomerId("");
    setCustomerIdGenerated(false);
    setLoadingCustomerId(false);
    setAddress("");
    setAadharNumber("");
    setSelectedBranch(null);

    setShowJewelleryTable(false);
    setJewelleryOptions([]);
    setRatePerGram(6000);
    setConfigLoading(true);

    setLoanAmount(0);
    setAllInterestRates([]);
    setSelectedInterestRate("");
    setLoanDate(defaultLoanDate);
    setLoanPeriod(defaultLoanPeriod);
    setDueDate(calculateDueDate(defaultLoanDate, defaultLoanPeriod));
    setNoOfDays(
      calculateDays(
        defaultLoanDate,
        calculateDueDate(defaultLoanDate, defaultLoanPeriod)
      )
    );
    setSelectedFactor(0);
    setTotalInterest(0);
    setPaymentMethod("offline");
    setRefNumber("");
    setPaymentByOnline("");
    setPaymentByOffline("");

    setCustomerPhoto(null);
    setJewelPhoto(null);
    setAadharPhoto(null);
    setDeclarationPhoto(null);
    setOtherPhoto(null);
    setSheetPreparedBy("");

    setPreviewData(null);
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
        singelLoanLoading,
        setSingelLoanLoading,
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
