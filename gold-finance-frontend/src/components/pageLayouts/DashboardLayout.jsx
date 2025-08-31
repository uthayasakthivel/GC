import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
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
    <div className="">
      <div className="flex justify-between items-center  p-4 ">
        <h1 className="text-2xl font-bold text-[#111012]">{dashboardTitle}</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-[#313485] to-[#00b8db] text-white font-semibold px-5 py-2 rounded-xl shadow-lg hover:from-[#00b8db] hover:to-[#313485] hover:scale-105 transition-all duration-300 ease-in-out backdrop-blur-md cursor-pointer"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
