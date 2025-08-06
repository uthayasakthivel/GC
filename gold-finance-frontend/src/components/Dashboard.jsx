// src/pages/Dashboard.jsx
import { useDashboardData } from "../hooks/useDashboardData";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import EmployeeDashboard from "../pages/Employee/EmployeeDashboard";

export default function Dashboard({ role }) {
  const { combinedRates, balance, closingBalance, loadingDashboardData } =
    useDashboardData();

  const dashboardProps = {
    combinedRates,
    balance,
    closingBalance,
    loadingDashboardData,
  };

  return (
    <div className="p-6">
      {role === "admin" && <AdminDashboard {...dashboardProps} />}
      {role === "manager" && <ManagerDashboard {...dashboardProps} />}
      {role === "employee" && <EmployeeDashboard {...dashboardProps} />}
    </div>
  );
}
