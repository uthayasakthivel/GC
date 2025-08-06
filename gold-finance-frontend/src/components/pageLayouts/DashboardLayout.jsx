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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex justify-between items-center bg-gradient-to-r from-amber-400 to-yellow-500 p-4 shadow">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg">
          {dashboardTitle}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-white text-amber-600 px-4 py-2 rounded-lg shadow hover:bg-amber-100 transition"
        >
          Logout
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
