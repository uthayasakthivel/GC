import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const JewelleryContext = createContext();

export const JewelleryProvider = ({ children }) => {
  const [showJewelleryTable, setShowJewelleryTable] = useState(false);
  const [jewelleryOptions, setJewelleryOptions] = useState([]);
  const [selectedJewels, setSelectedJewels] = useState([]);
  const [eligibleAmount, setEligibleAmount] = useState(0);
  const [totalEligibility, setTotalEligibility] = useState(0);
  const [ratePerGram, setRatePerGram] = useState(6000);
  const [configLoading, setConfigLoading] = useState(true);

  // Fetch jewellery options and rate per gram on mount
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
        setRatePerGram(rateRes?.data?.ratePerGram ?? 6000);
      } catch (err) {
        console.error("Error fetching jewellery config:", err);
      } finally {
        setConfigLoading(false);
      }
    };

    fetchConfig();
  }, []);

  console.log(ratePerGram, "ratepergram");

  // Optional: Reset jewellery state method
  const resetJewellery = () => {
    setShowJewelleryTable(false);
    setJewelleryOptions([]);
    setSelectedJewels([]);
    setEligibleAmount(0);
    setTotalEligibility(0);
    setRatePerGram(6000);
    setConfigLoading(true);
  };

  return (
    <JewelleryContext.Provider
      value={{
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
      }}
    >
      {children}
    </JewelleryContext.Provider>
  );
};

export const useJewellery = () => useContext(JewelleryContext);
