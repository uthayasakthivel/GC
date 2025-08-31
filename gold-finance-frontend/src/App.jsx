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
import Dashboard from "./components/Dashboard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Lottie from "lottie-react";
import loadingSpinner from "./assets/Coin_rotating.json";
import BuyingSheet from "./pages/sheets/BuyingSheet";
import ResetPassword from "./pages/publicPages/ResetPassword";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BuyingSheetPreview from "./pages/admin/BuyingSheetPreview";
import SellingSheetPreview from "./pages/admin/SellingSheetPreview";
// import AllBuyingSheets from "./pages/admin/AllBuyingSheets";
import SellingSheet from "./pages/sheets/SellingSheet";
import AllSheets from "./pages/admin/AllSheets";
import MeltingSheet from "./pages/sheets/MeltingSheet";
import MeltingSheetPreview from "./pages/admin/MeltingSheetPreview";
import FinanaceSheet from "./pages/sheets/FinanceSheet";
import { LoanProvider } from "./context/LoanContext";
import AllLoansPage from "./pages/Loan/AllLoansPage";
import ExistingLoanTab from "./pages/Loan/ExistingLoanLatest";
import LoanDetails from "./pages/Loan/LoanDetails";
import { BranchProvider } from "./context/BranchContext";
import { CustomerProvider } from "./context/CustomerContext";
import { JewelleryProvider } from "./context/JewelleryContext";
import { LoanDetailsProvider } from "./context/LoanDetailsContext";
import { MediaProvider } from "./context/MediaContext";
import { PreviewProvider } from "./context/PreviewContext";

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
            <Dashboard role="admin" />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/sheets/buying/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <BuyingSheetPreview sheetType="buying" />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/sheets/selling/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <SellingSheetPreview sheetType="selling" />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/sheets/melting/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <MeltingSheetPreview sheetType="melting" />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/buying-sheets"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AllSheets sheetType="buying" />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/selling-sheets"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AllSheets sheetType="selling" />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/melting-sheets"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AllSheets sheetType="melting" />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/admin/selling-sheets"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AllSellingSheets />
          </PrivateRoute>
        }
      /> */}
      {/* Buying Sheet route (protected for Admin) */}
      <Route
        path="/buying-sheet"
        element={
          <PrivateRoute allowedRoles={["admin", "manager", "employee"]}>
            <BuyingSheet />
          </PrivateRoute>
        }
      />
      {/* Selling Sheet route (protected for Admin) */}
      <Route
        path="/selling-sheet"
        element={
          <PrivateRoute allowedRoles={["admin", "manager"]}>
            <SellingSheet />
          </PrivateRoute>
        }
      />
      <Route
        path="/existing-loans-tab"
        element={
          <PrivateRoute allowedRoles={["admin", "manager"]}>
            <ExistingLoanTab />
          </PrivateRoute>
        }
      />

      {/* All loans page */}
      <Route
        path="/all-loans"
        element={
          <PrivateRoute allowedRoles={["admin", "manager"]}>
            <AllLoansPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/existing-loans"
        element={
          <PrivateRoute allowedRoles={["admin", "manager"]}>
            <AllLoansPage />
          </PrivateRoute>
        }
      />

      {/* Individual loan details */}
      <Route
        path="/loan/:id"
        element={
          <PrivateRoute allowedRoles={["admin", "manager"]}>
            <LoanDetails /> {/* <-- Create this new component */}
          </PrivateRoute>
        }
      />

      <Route
        path="/finance-sheet"
        element={
          <PrivateRoute allowedRoles={["admin", "manager"]}>
            <FinanaceSheet />
          </PrivateRoute>
        }
      />
      {/* Manager dashboard protected */}
      <Route
        path="/manager"
        element={
          <PrivateRoute allowedRoles={["manager"]}>
            <Dashboard role="manager" />
          </PrivateRoute>
        }
      />
      {/* Employee dashboard protected */}
      <Route
        path="/employee"
        element={
          <PrivateRoute allowedRoles={["employee"]}>
            <Dashboard role="employee" />
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
      <BranchProvider>
        <CustomerProvider>
          <JewelleryProvider>
            <LoanDetailsProvider>
              <MediaProvider>
                <PreviewProvider>
                  <LoanProvider>
                    <AuthProvider>
                      <ToastProvider>
                        <BrowserRouter>
                          <AppRoutes />
                        </BrowserRouter>
                      </ToastProvider>
                    </AuthProvider>
                  </LoanProvider>
                </PreviewProvider>
              </MediaProvider>
            </LoanDetailsProvider>
          </JewelleryProvider>
        </CustomerProvider>
      </BranchProvider>
    </QueryClientProvider>
  );
}

export default App;
