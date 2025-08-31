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

const LoanDetailsContext = createContext();

export const LoanDetailsProvider = ({ children }) => {
  // Access needed context (branches, selectedBranch, customerData)
  const { branches, selectedBranch } = useBranchContext();
  const { customerData } = useCustomerContext();

  // Loan numbers depend on selectedBranch
  const { nextLoanNumber, nextLoanNumberLoading } =
    useNextLoanNumber(selectedBranch);

  // Loan core fields
  const [loanAmount, setLoanAmount] = useState(0);
  const [allInterestRates, setAllInterestRates] = useState([]);
  const [selectedInterestRate, setSelectedInterestRate] = useState("");

  // Dates and periods
  const defaultLoanDate = new Date();
  const defaultLoanPeriod = 6; // months
  const [loanDate, setLoanDate] = useState(defaultLoanDate);
  const [loanPeriod, setLoanPeriod] = useState(defaultLoanPeriod);
  const [dueDate, setDueDate] = useState(() =>
    calculateDueDate(defaultLoanDate, defaultLoanPeriod)
  );
  const [noOfDays, setNoOfDays] = useState(() =>
    calculateDays(
      defaultLoanDate,
      calculateDueDate(defaultLoanDate, defaultLoanPeriod)
    )
  );

  // Single loan fetched data
  const [singleLoan, setSingleLoan] = useState(null);
  const [singleLoanLoading, setSingleLoanLoading] = useState(true);

  // Financials
  const [selectedFactor, setSelectedFactor] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("offline");
  const [refNumber, setRefNumber] = useState("");
  const [paymentByOnline, setPaymentByOnline] = useState("");
  const [paymentByOffline, setPaymentByOffline] = useState("");

  // Helpers to calculate due date and days
  function calculateDueDate(date, period) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + period);
    d.setDate(d.getDate() - 1);
    return d;
  }

  function calculateDays(start, end) {
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const resetLoanForm = () => {
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
  };

  // Fetch single loan by ID
  const fetchSingleLoan = useCallback(async (id) => {
    try {
      const res = await axiosInstance.get(`/loan/${id}`);
      if (res.data.success) {
        setSingleLoan(res.data.loan);
      }
    } catch (error) {
      console.error("Failed to fetch singleLoan details", error);
    } finally {
      setSingleLoanLoading(false);
    }
  }, []);

  // Loan days difference
  const calculateLoanDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);
    return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Derived loan days for interest calculation
  const noOfDaysLoan = singleLoan
    ? singleLoan.lastInterestPaidDate
      ? calculateLoanDays(singleLoan.lastInterestPaidDate, new Date())
      : calculateLoanDays(singleLoan.loanDate, new Date())
    : 0;

  const interestToPay =
    singleLoan && singleLoan.selectedFactor && singleLoan.loanAmount
      ? noOfDaysLoan * singleLoan.selectedFactor * singleLoan.loanAmount
      : 0;

  // Pay interest API call
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

  // Pay principal API call
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

  // Hooks for payment API calls
  const payInterest = useCallback(async (id, paidDate) => {
    try {
      const data = await payInterestAPI(id, paidDate);
      if (data.success) setSingleLoan(data.loan);
    } catch (error) {
      console.error("Error paying interest:", error);
    }
  }, []);

  const payPrincipal = useCallback(
    async (id, paidDate, newLoanAmount, status) => {
      try {
        const data = await payPrincipalAPI(id, paidDate, newLoanAmount, status);
        if (data.success) setSingleLoan(data.loan);
      } catch (error) {
        console.error("Error paying principal:", error);
      }
    },
    []
  );

  // Update due date and noOfDays when loanDate or loanPeriod changes
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

  return (
    <LoanDetailsContext.Provider
      value={{
        branches,
        selectedBranch,

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
        calculateLoanDays,
        noOfDaysLoan,
        interestToPay,

        payInterest,
        payPrincipal,

        resetLoanForm,
      }}
    >
      {children}
    </LoanDetailsContext.Provider>
  );
};

export const useLoanDetails = () => useContext(LoanDetailsContext);
