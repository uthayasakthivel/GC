import { useState } from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import DashboardHeader from "../../components/DashboardHeader";
import PendingApprovals from "../../components/PendingApprovals";
import UserList from "../../components/UserList";
import BranchManagement from "../../components/BranchManagement";
import JewelleryManagement from "../../components/JewelleryManagement";
import RateSetter from "../../components/RateSetter";
import OpeningBalanceForm from "../../components/OpeningBalanceForm";
import LatestSubmittedSheets from "../../components/LatestSubmittedSheets";
import CustomerRegistrationPage from "../../pages/Loan/CustomerRegistrationPage";
import ExistingCustomerLoan from "../../pages/Loan/ExistingCustomerLoan";
import ExistingLoanLatest from "../../pages/Loan/ExistingLoanLatest";
import { useAdminUsers } from "../../hooks/useAdminUsers";

export default function AdminDashboard({
  todayRates,
  buyingRates,
  combinedRates,
  balance,
  closingBalance,
  loadingDashboardData,
}) {
  const { pendingUsers, managers, employees, loading, error, refreshUsers } =
    useAdminUsers();

  const [activeMenu, setActiveMenu] = useState("goldSales");
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [openSubMenus, setOpenSubMenus] = useState({});

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

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
      ],
    },
    { label: "Pending Approvals", key: "pendingApprovals" },
    { label: "All Managers", key: "managers" },
    { label: "All Employees", key: "employees" },
    { label: "Branch Management", key: "branches" },
    { label: "Jewellery Management", key: "jewellery" },
    { label: "Rate Setter", key: "rates" },
    { label: "Opening Balance", key: "openingBalance" },
  ];

  const toggleSubMenu = (key, hasSubItems) => {
    if (!hasSubItems) {
      setActiveMenu(key);
      setActiveSubMenu(null);
      setOpenSubMenus({});
      return;
    }
    setActiveMenu(key);
    setOpenSubMenus((prev) => {
      const newOpen = {};
      if (!prev[key]) {
        newOpen[key] = true;
      }
      return newOpen;
    });
    const item = menuItems.find((item) => item.key === key);
    if (item?.subItems?.length) {
      setActiveSubMenu(item.subItems[0].key);
    } else {
      setActiveSubMenu(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Menu */}
      {/* Left Menu */}
      <div className="w-full lg:w-1/4 bg-[#313485] shadow-2xl text-white flex flex-col pt-8">
        <ul className="space-y-4 text-center flex-shrink-0 overflow-y-auto h-screen">
          {menuItems.map((item) => (
            <li key={item.key} className="relative">
              <button
                className={`w-full px-3 py-2 cursor-pointer flex justify-between items-center transition-colors duration-150 will-change-transform,background-color ${
                  activeMenu === item.key
                    ? "bg-white text-[#313485] font-semibold" // Active link = light bg, dark text
                    : "bg-[#313485] text-white hover:bg-cyan-700" // Non-active = dark bg, white text, hover lighter
                }`}
                onClick={() => toggleSubMenu(item.key, !!item.subItems)}
              >
                {item.label}
                {item.subItems && (
                  <span
                    className={`inline-block transform transition-transform duration-150 will-change-transform ${
                      openSubMenus[item.key] ? "rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                )}
              </button>

              {item.subItems && openSubMenus[item.key] && (
                <ul className="bg-white text-black rounded-md shadow-md mt-1 w-full z-20 relative">
                  {item.subItems.map((sub) => (
                    <li key={sub.key}>
                      <button
                        className={`w-full text-left px-3 py-2 cursor-pointer transition-colors duration-150 will-change-background-color ${
                          activeSubMenu === sub.key
                            ? "bg-green-600 text-white font-semibold" // Active sub = dark bg, white text
                            : "bg-white text-black hover:bg-cyan-200" // Non-active sub = light bg, hover lighter
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
      <div className="flex-1 h-screen overflow-y-auto p-6 bg-gray-50 scrollbar-hide">
        <DashboardLayout role="admin">
          <DashboardHeader
            role="admin"
            combinedRates={combinedRates}
            todayRates={todayRates}
            buyingRates={buyingRates}
            balance={balance}
            closingBalance={closingBalance}
            loadingDashboardData={loadingDashboardData}
          />

          <div className="mt-4 space-y-4">
            {activeMenu === "pendingApprovals" && (
              <PendingApprovals
                users={pendingUsers}
                onActionComplete={refreshUsers}
              />
            )}
            {activeMenu === "managers" && (
              <UserList
                users={managers}
                title="All Managers"
                onActionComplete={refreshUsers}
              />
            )}
            {activeMenu === "employees" && (
              <UserList
                users={employees}
                title="All Employees"
                onActionComplete={refreshUsers}
              />
            )}
            {activeMenu === "branches" && (
              <BranchManagement onBranchesUpdated={refreshUsers} />
            )}
            {activeMenu === "jewellery" && (
              <JewelleryManagement onJewelleryUpdated={refreshUsers} />
            )}
            {activeMenu === "rates" && <RateSetter />}
            {activeMenu === "openingBalance" && (
              <OpeningBalanceForm onBalanceUpdated={refreshUsers} />
            )}

            {/* Gold Sales */}
            {activeMenu === "goldSales" && activeSubMenu && (
              <LatestSubmittedSheets role="admin" sheetType={activeSubMenu} />
            )}

            {/* Gold Finance */}
            {activeMenu === "goldFinance" && activeSubMenu && (
              <LatestSubmittedSheets role="admin" sheetType={activeSubMenu} />
            )}

            {/* Gold Loan */}
            {activeMenu === "goldLoan" && activeSubMenu && (
              <div>
                {activeSubMenu === "newCustomer" && (
                  <CustomerRegistrationPage /> //p
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
