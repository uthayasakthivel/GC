import DashboardLayout from "../components/DashboardLayout";
import { useEffect, useState } from "react";
import RatesSection from "../components/RatesSection";
import NavigationTree from "../components/NavigationTree";
import BalanceSection from "../components/BalanceSection";

export default function EmployeeDashboard() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/rates");
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data = await res.json();
        setRates(data);
      } catch (error) {
        console.error("Error fetching rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return (
    <DashboardLayout role="employee">
      {loading ? <p>Loading rates...</p> : <RatesSection rates={rates} />}
      <NavigationTree />
      <BalanceSection />
    </DashboardLayout>
  );
}
