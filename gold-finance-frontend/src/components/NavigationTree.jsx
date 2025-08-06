import { useState } from "react";
import LatestSubmittedSheets from "./LatestSubmittedSheets";
import SellingSheet from "../pages/sheets/SellingSheet";
import MeltingSheet from "../pages/sheets/MeltingSheet";
import FinanceSheet from "../pages/sheets/FinanceSheet";

export default function GoldTabs({ role }) {
  // Main Tabs
  const [mainTab, setMainTab] = useState("sales");
  // Sub Tabs
  const [subTab, setSubTab] = useState("buying");

  return (
    <div className="w-full">
      {/* Main Tabs */}
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

      {/* Sub Tabs + Content */}
      {mainTab === "sales" && (
        <div>
          {/* Sub Tabs */}
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

          {/* Content */}
          <div className="p-4 bg-white shadow rounded-lg">
            {subTab === "buying" && <LatestSubmittedSheets role={role} />}
            {subTab === "selling" &&
              (role === "admin" || role === "manager") && <SellingSheet />}
            {subTab === "melting" &&
              (role === "admin" || role === "manager") && <MeltingSheet />}
            {!subTab && <div>Please select a sheet above.</div>}
          </div>
        </div>
      )}

      {mainTab === "finance" && (
        <div>
          {/* Sub Tabs */}
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

          {/* Content */}
          <div className="p-4 bg-white shadow rounded-lg">
            {subTab === "finance-sheet" && <FinanceSheet />}
            {!subTab && <div>Please select a sheet above.</div>}
          </div>
        </div>
      )}

      {mainTab === "loan" && (
        <div>
          {/* Sub Tabs */}
          <div className="flex border-b border-gray-200 mb-3">
            <button
              className={`px-4 py-1 ${
                subTab === "loan1"
                  ? "border-b-2 border-amber-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setSubTab("loan1")}
            >
              Loan Tab 1
            </button>
            <button
              className={`px-4 py-1 ${
                subTab === "loan2"
                  ? "border-b-2 border-amber-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setSubTab("loan2")}
            >
              Loan Tab 2
            </button>
          </div>

          {/* Content */}
          <div className="p-4 bg-white shadow rounded-lg">
            {subTab === "loan1" && <div>Loan feature coming soon...</div>}
            {subTab === "loan2" && (
              <div>Another loan feature coming soon...</div>
            )}
            {!subTab && <div>Please select a tab above.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
