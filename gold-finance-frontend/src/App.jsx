// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Login from "./pages/publicPages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import { ToastProvider } from "./components/ToastContext";
import HomePage from "./pages/publicPages/HomePage";
import SignUp from "./pages/publicPages/SignUp";
import ForgotPassword from "./pages/publicPages/ForgotPassword";
import { useEffect, useState } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Lottie from "lottie-react";
import loadingSpinner from "./assets/Coin_rotating.json";
import BuyingSheet from "./pages/sheets/BuyingSheet";
import ResetPassword from "./pages/publicPages/ResetPassword";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminSheetPreview from "./pages/admin/AdminSheetPreview";
import AllBuyingSheets from "./pages/admin/AllBuyingSheets";

function AppRoutes() {
  const { loading: authLoading } = useAuth();
  const [fakeLoading, setFakeLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setFakeLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (authLoading || fakeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <Lottie
            animationData={loadingSpinner}
            loop={true}
            className="w-40 md:w-60 lg:w-100"
          />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Dummy homepage at "/" */}
      <Route path="/" element={<HomePage />} />
      {/* 
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} /> */}

      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Signup page */}
      <Route path="/signup" element={<SignUp />} />

      {/* Forgot password page */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Admin dashboard protected */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/sheets/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminSheetPreview />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/buying-sheets"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AllBuyingSheets />
          </PrivateRoute>
        }
      />

      {/* Buying Sheet route (protected for Admin) */}
      <Route
        path="/buying-sheet"
        element={
          <PrivateRoute allowedRoles={["admin", "employee"]}>
            <BuyingSheet />
          </PrivateRoute>
        }
      />

      {/* Manager dashboard protected */}
      <Route
        path="/manager"
        element={
          <PrivateRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </PrivateRoute>
        }
      />

      {/* Employee dashboard protected */}
      <Route
        path="/employee"
        element={
          <PrivateRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />

      {/* Catch all - redirect unknown routes to homepage */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
