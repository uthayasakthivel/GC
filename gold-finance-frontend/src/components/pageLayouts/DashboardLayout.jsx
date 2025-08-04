import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ role, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token or session
    localStorage.removeItem("token"); // or sessionStorage.removeItem()
    navigate("/");
  };

  // Set dashboard title based on role
  let dashboardTitle = "Dashboard";
  if (role === "admin") dashboardTitle = "Admin Dashboard";
  else if (role === "manager") dashboardTitle = "Manager Dashboard";
  else if (role === "employee") dashboardTitle = "Employee Dashboard";

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{dashboardTitle}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}
