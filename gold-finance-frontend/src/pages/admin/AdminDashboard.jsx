// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
// import PendingApprovals from "../../components/PendingApprovals";
// import UserList from "../../components/UserList";
// import axios from "../../api/axiosInstance";
// import BranchManagement from "../../components/BranchManagement";
// import RateSetter from "../../components/RateSetter";
// import OpeningBalanceForm from "../../components/OpeningBalanceForm";
// import LatestSubmittedSheets from "../../components/LatestSubmittedSheets";

// export default function AdminDashboard() {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [managers, setManagers] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const [pendingRes, managersRes, employeesRes] = await Promise.all([
//         axios.get("/admin/users", { params: { status: "pending" } }),
//         axios.get("/admin/users", {
//           params: { role: "manager", status: "approved" },
//         }),
//         axios.get("/admin/users", {
//           params: { role: "employee", status: "approved" },
//         }),
//       ]);
//       setPendingUsers(pendingRes.data);
//       setManagers(managersRes.data);
//       setEmployees(employeesRes.data);
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load users.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleRefresh = () => fetchUsers();

//   if (loading) return <div className="p-4">Loading users...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;

//   return (
//     <DashboardLayout role="admin">
//       {/* Existing user lists */}
//       <PendingApprovals users={pendingUsers} onActionComplete={handleRefresh} />
//       <UserList
//         users={managers}
//         title="All Managers"
//         onActionComplete={handleRefresh}
//       />
//       <UserList
//         users={employees}
//         title="All Employees"
//         onActionComplete={handleRefresh}
//       />

//       {/* Admin-only features */}
//       <LatestSubmittedSheets />
//       <BranchManagement onBranchesUpdated={handleRefresh} />
//       <RateSetter />
//       <OpeningBalanceForm onBalanceUpdated={handleRefresh} />
//     </DashboardLayout>
//   );
// }

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import PendingApprovals from "../../components/PendingApprovals";
import UserList from "../../components/UserList";
import axios from "../../api/axiosInstance";
import BranchManagement from "../../components/BranchManagement";
import RateSetter from "../../components/RateSetter";
import OpeningBalanceForm from "../../components/OpeningBalanceForm";
import LatestSubmittedSheets from "../../components/LatestSubmittedSheets";
import { useDashboardData } from "../../hooks/useDashboardData";
import RatesSection from "../../components/RatesSection";
import NavigationTree from "../../components/NavigationTree";
import BalanceSection from "../../components/BalanceSection";

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { combinedRates, balance, closingBalance, loadingDashboardData } =
    useDashboardData();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [pendingRes, managersRes, employeesRes] = await Promise.all([
        axios.get("/admin/users", { params: { status: "pending" } }),
        axios.get("/admin/users", {
          params: { role: "manager", status: "approved" },
        }),
        axios.get("/admin/users", {
          params: { role: "employee", status: "approved" },
        }),
      ]);
      setPendingUsers(pendingRes.data);
      setManagers(managersRes.data);
      setEmployees(employeesRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => fetchUsers();

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <DashboardLayout role="admin">
      {/* Existing user lists */}
      {loadingDashboardData ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <RatesSection rates={combinedRates} />
          <NavigationTree />
          <BalanceSection balance={balance} closingBalance={closingBalance} />
        </>
      )}
      <PendingApprovals users={pendingUsers} onActionComplete={handleRefresh} />
      <UserList
        users={managers}
        title="All Managers"
        onActionComplete={handleRefresh}
      />
      <UserList
        users={employees}
        title="All Employees"
        onActionComplete={handleRefresh}
      />

      {/* Admin-only features */}
      <LatestSubmittedSheets />
      <BranchManagement onBranchesUpdated={handleRefresh} />
      <RateSetter />
      <OpeningBalanceForm onBalanceUpdated={handleRefresh} />
    </DashboardLayout>
  );
}
