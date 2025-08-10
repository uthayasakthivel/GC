// src/pages/admin/AdminDashboard.jsx
import React from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import PendingApprovals from "../../components/PendingApprovals";
import UserList from "../../components/UserList";
import BranchManagement from "../../components/BranchManagement";
import RateSetter from "../../components/RateSetter";
import OpeningBalanceForm from "../../components/OpeningBalanceForm";
import DashboardHeader from "../../components/DashboardHeader";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import JewelleryManagement from "../../components/JewelleryManagement";

export default function AdminDashboard({
  todayRates,
  buyingRates,
  combinedRates,
  balance,
  closingBalance,
  loadingDashboardData,
}) {
  const { pendingUsers, managers, employees, loading, error, refreshUsers } =
    useAdminUsers();

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    // For show the Dashboard heading and logout button
    <DashboardLayout role="admin">
      {/* Dashboard Header with Rates, Navigation, and Balance */}
      <DashboardHeader
        role="admin"
        combinedRates={combinedRates}
        todayRates={todayRates}
        buyingRates={buyingRates}
        balance={balance}
        closingBalance={closingBalance}
        loadingDashboardData={loadingDashboardData}
      />

      <PendingApprovals users={pendingUsers} onActionComplete={refreshUsers} />
      <UserList
        users={managers}
        title="All Managers"
        onActionComplete={refreshUsers}
      />
      <UserList
        users={employees}
        title="All Employees"
        onActionComplete={refreshUsers}
      />

      <BranchManagement onBranchesUpdated={refreshUsers} />
      <JewelleryManagement onJewelleryUpdated={refreshUsers} />

      <RateSetter />
      <OpeningBalanceForm onBalanceUpdated={refreshUsers} />
    </DashboardLayout>
  );
}
