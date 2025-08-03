import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import UserList from "../components/UserList";
import PendingApprovals from "./PendingApprovals";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const managers = users.filter((u) => u.role === "manager");
  const employees = users.filter((u) => u.role === "employee");

  return (
    <DashboardLayout role="admin">
      <PendingApprovals />
      <UserList users={managers} title="All Managers" />
      <UserList users={employees} title="All Employees" />
    </DashboardLayout>
  );
}
