import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import endpoints from "../api/endpoints";

export function useDashboardData() {
  const [todayRates, setTodayRates] = useState(null);
  const [buyingRates, setBuyingRates] = useState(null);
  const [balance, setBalance] = useState(null);
  const [closingBalance, setClosingBalance] = useState(null);
  const [loadingDashboardData, setLoadingDashboardData] = useState(true);
  const [error, setError] = useState(null);
  const fetchDashboardData = async () => {
    try {
      setLoadingDashboardData(true);
      const [todayRatesRes, buyingRatesRes, balanceRes, closingBalanceRes] =
        await Promise.all([
          axios.get("/admin/config/rates/today"),
          axios.get("/admin/config/rates/buying"),
          axios.get("/admin/config/opening-balance"),
          axios.get("/admin/config/closing-balance"),
        ]);
      console.log(todayRatesRes, "mm");
      setTodayRates(todayRatesRes.data);
      setBuyingRates(buyingRatesRes.data);
      setBalance(balanceRes.data);
      setClosingBalance(closingBalanceRes.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoadingDashboardData(false);
    }
  };

  useEffect(() => {
    if (todayRates && buyingRates) {
      console.log(todayRates, buyingRates, "rates ✅");
    }
  }, [todayRates, buyingRates]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Combine rates into one object
  const combinedRates = {
    ...todayRates,
    ...buyingRates,
  };

  return {
    combinedRates,
    balance,
    closingBalance,
    loadingDashboardData,
    error,
    refetch: fetchDashboardData,
  };
}
