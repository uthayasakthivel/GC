// src/components/DashboardHeader.jsx
import RatesSection from "./RatesSection";
import NavigationTree from "./NavigationTree";
import BalanceSection from "./BalanceSection";

export default function DashboardHeader({
  role,
  combinedRates,
  todayRates,
  buyingRates,
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
      <RatesSection
        rates={combinedRates}
        todayRates={todayRates}
        buyingRates={buyingRates}
      />
      {role === "admin" && (
        <BalanceSection balance={balance} closingBalance={closingBalance} />
      )}
      <NavigationTree role={role} />
    </>
  );
}
