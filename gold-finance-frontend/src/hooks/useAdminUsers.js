// src/hooks/useAdminUsers.js
import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export function useAdminUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return {
    pendingUsers,
    managers,
    employees,
    loading,
    error,
    refreshUsers: fetchUsers,
  };
}
