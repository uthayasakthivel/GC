import { useState } from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import DashboardHeader from "../../components/DashboardHeader";
import LatestSubmittedSheets from "../../components/LatestSubmittedSheets";
import CustomerRegistrationPage from "../../pages/Loan/CustomerRegistrationPage";
import ExistingCustomerLoan from "../../pages/Loan/ExistingCustomerLoan";
import ExistingLoanLatest from "../../pages/Loan/ExistingLoanLatest";

export default function ManagerDashboard({
  todayRates,
  buyingRates,
  combinedRates,
  balance,
  closingBalance,
  loadingDashboardData,
}) {
  const [activeMenu, setActiveMenu] = useState("goldSales");
  const [activeSubMenu, setActiveSubMenu] = useState("buying");

  const menuItems = [
    {
      label: "Gold Sales",
      key: "goldSales",
      subItems: [
        { label: "Buying Sheet", key: "buying" },
        { label: "Selling Sheet", key: "selling" },
        { label: "Melting Sheet", key: "melting" },
      ],
    },
    {
      label: "Gold Finance",
      key: "goldFinance",
      subItems: [{ label: "Finance Sheet", key: "finance" }],
    },
    {
      label: "Gold Loan",
      key: "goldLoan",
      subItems: [
        { label: "New Customer Loan", key: "newCustomer" },
        { label: "Existing Customer Loan", key: "existingCustomer" },
        { label: "Existing Loan Latest", key: "existingLoan" },
        { label: "Topup", key: "topup" },
      ],
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white shadow rounded-lg sticky top-0 overflow-y-auto overflow-x-hidden flex flex-col justify-center">
        <ul className="space-y-4 text-center">
          {menuItems.map((item) => (
            <li key={item.key} className="relative group">
              {/* Main Menu */}
              <button
                className={`w-full px-3 py-2 rounded-lg ${
                  activeMenu === item.key
                    ? "bg-amber-100 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  setActiveMenu(item.key);
                  if (item.subItems && !activeSubMenu)
                    setActiveSubMenu(item.subItems[0].key);
                }}
              >
                {item.label}
              </button>

              {/* Submenu */}
              {item.subItems && (
                <ul className="absolute left-full top-0 ml-1 w-48 bg-white shadow rounded-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
                  {item.subItems.map((sub) => (
                    <li key={sub.key}>
                      <button
                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                          activeSubMenu === sub.key ? "bg-amber-200" : ""
                        }`}
                        onClick={() => {
                          setActiveMenu(item.key);
                          setActiveSubMenu(sub.key);
                        }}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Content */}
      <div className="flex-1 w-full lg:w-3/4 p-4 lg:p-6">
        <DashboardLayout role="manager">
          <DashboardHeader
            role="manager"
            combinedRates={combinedRates}
            todayRates={todayRates}
            buyingRates={buyingRates}
            balance={balance}
            closingBalance={closingBalance}
            loadingDashboardData={loadingDashboardData}
          />

          <div className="mt-4">
            {activeMenu === "goldSales" && activeSubMenu && (
              <LatestSubmittedSheets role="manager" sheetType={activeSubMenu} />
            )}

            {activeMenu === "goldFinance" && activeSubMenu && (
              <LatestSubmittedSheets role="manager" sheetType={activeSubMenu} />
            )}

            {activeMenu === "goldLoan" && activeSubMenu && (
              <div>
                {activeSubMenu === "newCustomer" && (
                  <CustomerRegistrationPage />
                )}
                {activeSubMenu === "existingCustomer" && (
                  <ExistingCustomerLoan />
                )}
                {activeSubMenu === "existingLoan" && <ExistingLoanLatest />}
              </div>
            )}
          </div>
        </DashboardLayout>
      </div>
    </div>
  );
}
