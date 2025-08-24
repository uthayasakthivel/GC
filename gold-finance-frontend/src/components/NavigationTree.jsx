import { useState } from "react";
import LatestSubmittedSheets from "./LatestSubmittedSheets";
import SellingSheet from "../pages/sheets/SellingSheet";
import MeltingSheet from "../pages/sheets/MeltingSheet";
import FinanceSheet from "../pages/sheets/FinanceSheet";
import CustomerRegistrationPage from "../pages/Loan/CustomerRegistrationPage";

export default function GoldTabs({ role }) {
  // Main Tabs
  const [mainTab, setMainTab] = useState("sales");
  // Sub Tabs
  const [subTab, setSubTab] = useState("buying");
  const [innerTab, setInnerTab] = useState("newCustomer");
  return (
    <div className="w-full">
      <div className="flex border-b border-gray-300 mb-4">
        <button
          className={`px-6 py-2 ${
            mainTab === "sales"
              ? "border-b-2 border-amber-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => {
            setMainTab("sales");
            setSubTab("");
          }}
        >
          Gold Sales
        </button>
        <button
          className={`px-6 py-2 ${
            mainTab === "finance"
              ? "border-b-2 border-amber-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => {
            setMainTab("finance");
            setSubTab("");
          }}
        >
          Gold Finance
        </button>
        <button
          className={`px-6 py-2 ${
            mainTab === "loan"
              ? "border-b-2 border-amber-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => {
            setMainTab("loan");
            setSubTab("");
          }}
        >
          Gold Loan
        </button>
      </div>

      {/* Sales Section */}
      {mainTab === "sales" && (
        <div>
          <div className="flex border-b border-gray-200 mb-3">
            <button
              className={`px-4 py-1 ${
                subTab === "buying"
                  ? "border-b-2 border-amber-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setSubTab("buying")}
            >
              Buying Sheet
            </button>
            {(role === "admin" || role === "manager") && (
              <>
                <button
                  className={`px-4 py-1 ${
                    subTab === "selling"
                      ? "border-b-2 border-amber-500 font-semibold"
                      : "text-gray-500"
                  }`}
                  onClick={() => setSubTab("selling")}
                >
                  Selling Sheet
                </button>
                <button
                  className={`px-4 py-1 ${
                    subTab === "melting"
                      ? "border-b-2 border-amber-500 font-semibold"
                      : "text-gray-500"
                  }`}
                  onClick={() => setSubTab("melting")}
                >
                  Melting Sheet
                </button>
              </>
            )}
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            {subTab === "buying" && (
              <LatestSubmittedSheets role={role} sheetType="buying" />
            )}
            {subTab === "selling" &&
              (role === "admin" || role === "manager") && (
                <LatestSubmittedSheets role={role} sheetType="selling" />
              )}
            {subTab === "melting" &&
              (role === "admin" || role === "manager") && (
                <LatestSubmittedSheets role={role} sheetType="melting" />
              )}

            {!subTab && <div>Please select a sheet above.</div>}
          </div>
        </div>
      )}

      {/* Finance Section */}
      {mainTab === "finance" && (
        <div>
          <div className="flex border-b border-gray-200 mb-3">
            <button
              className={`px-4 py-1 ${
                subTab === "finance-sheet"
                  ? "border-b-2 border-amber-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setSubTab("finance-sheet")}
            >
              Finance Sheet
            </button>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            {subTab === "finance-sheet" &&
              (role === "admin" || role === "manager") && (
                <LatestSubmittedSheets role={role} sheetType="finance" />
              )}

            {!subTab && <div>Please select a sheet above.</div>}
          </div>
        </div>
      )}

      {/* Loan Section */}
      {mainTab === "loan" && (
        <div>
          {/* Main Loan Tabs */}
          <div className="flex border-b border-gray-200 mb-3">
            <button
              className={`px-4 py-1 ${
                subTab === "newLoan"
                  ? "border-b-2 border-amber-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setSubTab("newLoan")}
            >
              New Loan
            </button>
            <button
              className={`px-4 py-1 ${
                subTab === "existingLoan"
                  ? "border-b-2 border-amber-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setSubTab("existingLoan")}
            >
              Existing Loan
            </button>
            <button
              className={`px-4 py-1 ${
                subTab === "pledgeDetails"
                  ? "border-b-2 border-amber-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setSubTab("pledgeDetails")}
            >
              Pledge Details
            </button>
            <button
              className={`px-4 py-1 ${
                subTab === "interestCalculator"
                  ? "border-b-2 border-amber-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setSubTab("interestCalculator")}
            >
              Interest Calculator
            </button>
          </div>

          {/* Loan Content Area */}
          <div className="p-4 bg-white shadow rounded-lg">
            {subTab === "newLoan" && (
              <div>
                {/* New Loan Inner Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    className={`px-4 py-1 ${
                      innerTab === "newCustomer"
                        ? "border-b-2 border-blue-500 font-semibold"
                        : "text-gray-500"
                    }`}
                    onClick={() => setInnerTab("newCustomer")}
                  >
                    New Customer
                  </button>
                  <button
                    className={`px-4 py-1 ${
                      innerTab === "existingCustomer"
                        ? "border-b-2 border-blue-500 font-semibold"
                        : "text-gray-500"
                    }`}
                    onClick={() => setInnerTab("existingCustomer")}
                  >
                    Existing Customer
                  </button>
                </div>

                {/* New Loan Inner Content */}
                <div className="mt-3">
                  {innerTab === "newCustomer" && <CustomerRegistrationPage />}
                  {innerTab === "existingCustomer" && (
                    <div className="text-gray-600">
                      Feature for Existing Customer coming soon...
                    </div>
                  )}
                </div>
              </div>
            )}

            {subTab === "existingLoan" && (
              <div>Another loan feature coming soon...</div>
            )}
            {subTab === "pledgeDetails" && (
              <div>Loan feature coming soon...</div>
            )}
            {subTab === "interestCalculator" && (
              <div>Another loan feature coming soon...</div>
            )}
            {!subTab && <div>Please select a tab above.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
