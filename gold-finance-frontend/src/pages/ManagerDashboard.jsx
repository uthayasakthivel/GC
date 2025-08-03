import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import UserList from "../components/UserList";

export default function ManagerDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users"); // adjust URL if needed
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        // You may show toast here if you have a toast context
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const employees = users.filter((u) => u.role === "employee");

  return (
    <DashboardLayout role="manager">
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <UserList users={employees} title="All Employees" />
      )}
    </DashboardLayout>
  );
}
