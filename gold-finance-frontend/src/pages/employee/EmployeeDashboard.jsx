// src/pages/employee/EmployeeDashboard.jsx
import React from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import RatesSection from "../../components/RatesSection";
import BalanceSection from "../../components/BalanceSection";
import NavigationTree from "../../components/NavigationTree";
import DashboardHeader from "../../components/DashboardHeader";

export default function EmployeeDashboard({
  todayRates,
  buyingRates,
  combinedRates,
  balance,
  closingBalance,
  loadingDashboardData,
}) {
  return (
    <DashboardLayout role="employee">
      {/* Dashboard Header with Rates, Navigation, and Balance */}
      <DashboardHeader
        role="employee"
        combinedRates={combinedRates}
        todayRates={todayRates}
        buyingRates={buyingRates}
        balance={balance}
        closingBalance={closingBalance}
        loadingDashboardData={loadingDashboardData}
      />

      {/* Add Employee-specific features here */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Employee Tools</h2>
        <p>Employee-specific functionality will be added here.</p>
      </div>
    </DashboardLayout>
  );
}
