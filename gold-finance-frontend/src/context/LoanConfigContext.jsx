import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axiosInstance";

const LoanConfigContext = createContext();

export const LoanConfigProvider = ({ children }) => {
  // ---- Jewellery Config ----
  const [jewelleryOptions, setJewelleryOptions] = useState([]);
  const [ratePerGram, setRatePerGram] = useState(6000);
  const [configLoading, setConfigLoading] = useState(true);

  // ---- Interest Rates ----
  const [allInterestRates, setAllInterestRates] = useState([]);
  const [selectedInterestRate, setSelectedInterestRate] = useState("");

  // ✅ Fetch Jewellery Options & Gold Loan Rate
  useEffect(() => {
    const fetchJewelleryAndRate = async () => {
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

    fetchJewelleryAndRate();
  }, []);

  // ✅ Fetch Loan Interest Rates
  useEffect(() => {
    const fetchLoanInterest = async () => {
      try {
        const response = await axiosInstance.get(
          "/admin/config/interest-rates"
        );
        setAllInterestRates(response.data);
        if (response.data.length > 0) {
          setSelectedInterestRate(response.data[0]._id);
        }
      } catch (error) {
        console.error("Failed to load interest rates", error);
      }
    };

    fetchLoanInterest();
  }, []);

  // ✅ Memoized value for performance
  const value = useMemo(
    () => ({
      jewelleryOptions,
      ratePerGram,
      configLoading,
      allInterestRates,
      selectedInterestRate,
      setSelectedInterestRate,
    }),
    [
      jewelleryOptions,
      ratePerGram,
      configLoading,
      allInterestRates,
      selectedInterestRate,
    ]
  );

  return (
    <LoanConfigContext.Provider value={value}>
      {children}
    </LoanConfigContext.Provider>
  );
};

export const useLoanConfig = () => {
  const context = useContext(LoanConfigContext);
  if (!context) {
    throw new Error("useLoanConfig must be used within a LoanConfigProvider");
  }
  return context;
};
