import { useEffect, useState } from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import RatesSection from "../../components/RatesSection";
import NavigationTree from "../../components/NavigationTree";
import BalanceSection from "../../components/BalanceSection";
import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

export default function EmployeeDashboard() {
  const [todayRates, setTodayRates] = useState(null);
  const [buyingRates, setBuyingRates] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const axios = axiosInstance;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [todayRes, buyingRes, balanceRes] = await Promise.all([
          axios.get("/admin/config/rates/today"),
          axios.get("/admin/config/rates/buying"), // buying rates API
          axios.get(endpoints.getOpeningBalance),
        ]);

        setTodayRates(todayRes.data);
        setBuyingRates(buyingRes.data);
        setBalance(balanceRes.data);

        console.log("Today Rates:", todayRes.data);
        console.log("Buying Rates:", buyingRes.data);
        console.log("Balance:", balanceRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Combine rates into a single object to pass to RatesSection
  const combinedRates = {
    ...todayRates,
    ...buyingRates,
  };

  return (
    <DashboardLayout role="employee">
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <RatesSection rates={combinedRates} />
      )}
      <NavigationTree />
      <BalanceSection balance={balance} />
    </DashboardLayout>
  );
}
