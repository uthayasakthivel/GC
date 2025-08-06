// src/components/DashboardHeader.jsx
import RatesSection from "./RatesSection";
import NavigationTree from "./NavigationTree";
import BalanceSection from "./BalanceSection";

export default function DashboardHeader({
  role,
  combinedRates,
  balance,
  closingBalance,
  loadingDashboardData,
}) {
  if (loadingDashboardData) {
    return <p>Loading dashboard data...</p>;
  }
  console.log(role, "role in DashboardHeader");
  return (
    <>
      <RatesSection rates={combinedRates} />
      {role === "admin" && (
        <BalanceSection balance={balance} closingBalance={closingBalance} />
      )}
      <NavigationTree role={role} />
    </>
  );
}
