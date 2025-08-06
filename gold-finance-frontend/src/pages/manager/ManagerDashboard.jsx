// src/pages/employee/ManagerDashboard.jsx
import React from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import DashboardHeader from "../../components/DashboardHeader";

export default function ManagerDashboard({
  combinedRates,
  balance,
  closingBalance,
  loadingDashboardData,
}) {
  return (
    <DashboardLayout role="manager">
      {/* Dashboard Header with Rates, Navigation, and Balance */}
      <DashboardHeader
        role="manager"
        combinedRates={combinedRates}
        balance={balance}
        closingBalance={closingBalance}
        loadingDashboardData={loadingDashboardData}
      />

      {/* Add Manager-specific features here */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Manager Tools</h2>
        <p>Manager-specific functionality will be added here.</p>
      </div>
    </DashboardLayout>
  );
}
