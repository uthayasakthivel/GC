import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PendingApprovals from "../components/PendingApprovals";
import UserList from "../components/UserList";
import axios from "../api/axiosInstance";

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Pending users (status: pending)
      const pendingRes = await axios.get("/admin/users", {
        params: { status: "pending" },
      });
      setPendingUsers(pendingRes.data);

      // Approved managers
      const managersRes = await axios.get("/admin/users", {
        params: { role: "manager", status: "approved" },
      });
      setManagers(managersRes.data);

      // Approved employees
      const employeesRes = await axios.get("/admin/users", {
        params: { role: "employee", status: "approved" },
      });
      setEmployees(employeesRes.data);

      setError(null);
    } catch (err) {
      setError("Failed to load users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Refresh lists after approve/delete actions
  const handleRefresh = () => fetchUsers();

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <DashboardLayout role="admin">
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
    </DashboardLayout>
  );
}
