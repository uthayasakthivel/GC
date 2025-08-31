// import { useState } from "react";
// import LatestSubmittedSheets from "./LatestSubmittedSheets";
// import SellingSheet from "../pages/sheets/SellingSheet";
// import MeltingSheet from "../pages/sheets/MeltingSheet";
// import FinanceSheet from "../pages/sheets/FinanceSheet";
// import CustomerRegistrationPage from "../pages/Loan/CustomerRegistrationPage";
// import ExistingCustomerLoan from "../pages/Loan/ExistingCustomerLoan";
// import ExistingLoanLatest from "../pages/Loan/ExistingLoanLatest";

// export default function GoldTabs({ role }) {
//   const [mainTab, setMainTab] = useState("sales");
//   const [subTab, setSubTab] = useState("buying");
//   const [innerTab, setInnerTab] = useState("newCustomer");

//   // Define menu structure
//   const menuItems = [
//     {
//       label: "Gold Sales",
//       value: "sales",
//       subItems: [
//         { label: "Buying Sheet", value: "buying" },
//         ...(role === "admin" || role === "manager"
//           ? [
//               { label: "Selling Sheet", value: "selling" },
//               { label: "Melting Sheet", value: "melting" },
//             ]
//           : []),
//       ],
//     },
//     {
//       label: "Gold Finance",
//       value: "finance",
//       subItems: [{ label: "Finance Sheet", value: "finance-sheet" }],
//     },
//     {
//       label: "Gold Loan",
//       value: "loan",
//       subItems: [
//         { label: "New Loan", value: "newLoan" },
//         { label: "Existing Loan", value: "existingLoan" },
//         { label: "Pledge Details", value: "pledgeDetails" },
//         { label: "Interest Calculator", value: "interestCalculator" },
//       ],
//     },
//   ];

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 w-full">
//       {/* Left Menu */}
//       <nav className="w-full lg:w-1/4 bg-white shadow rounded-lg p-4">
//         <ul className="space-y-2">
//           {menuItems.map((item) => (
//             <li key={item.value}>
//               <button
//                 className={`w-full text-left px-3 py-2 rounded-lg ${
//                   mainTab === item.value
//                     ? "bg-amber-100 font-semibold"
//                     : "hover:bg-gray-100 text-gray-700"
//                 }`}
//                 onClick={() => {
//                   setMainTab(item.value);
//                   setSubTab(item.subItems[0].value);
//                   if (item.value === "loan") setInnerTab("newCustomer");
//                 }}
//               >
//                 {item.label}
//               </button>

//               {/* Sub Menu */}
//               {mainTab === item.value && item.subItems.length > 0 && (
//                 <ul className="mt-2 ml-2 space-y-1">
//                   {item.subItems.map((sub) => (
//                     <li key={sub.value}>
//                       <button
//                         className={`w-full text-left px-3 py-1 rounded-lg text-sm ${
//                           subTab === sub.value
//                             ? "bg-amber-200 font-medium"
//                             : "hover:bg-gray-100 text-gray-600"
//                         }`}
//                         onClick={() => setSubTab(sub.value)}
//                       >
//                         {sub.label}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Right Content */}
//       <div className="flex-1 flex flex-col gap-4">
//         {/* Sales Section */}
//         {mainTab === "sales" && (
//           <div>
//             <div className="p-4 bg-white shadow rounded-lg">
//               {subTab === "buying" && (
//                 <LatestSubmittedSheets role={role} sheetType="buying" />
//               )}
//               {subTab === "selling" && (
//                 <LatestSubmittedSheets role={role} sheetType="selling" />
//               )}
//               {subTab === "melting" && (
//                 <LatestSubmittedSheets role={role} sheetType="melting" />
//               )}
//             </div>
//           </div>
//         )}

//         {/* Finance Section */}
//         {mainTab === "finance" && (
//           <div>
//             <div className="p-4 bg-white shadow rounded-lg">
//               {subTab === "finance-sheet" && (
//                 <LatestSubmittedSheets role={role} sheetType="finance" />
//               )}
//             </div>
//           </div>
//         )}

//         {/* Loan Section */}
//         {mainTab === "loan" && (
//           <div>
//             <div className="p-4 bg-white shadow rounded-lg">
//               {subTab === "newLoan" && (
//                 <div>
//                   <div className="flex gap-2 border-b border-gray-200 mb-4">
//                     <button
//                       className={`px-3 py-1 rounded-lg ${
//                         innerTab === "newCustomer"
//                           ? "bg-blue-100 font-semibold"
//                           : "hover:bg-gray-100 text-gray-600"
//                       }`}
//                       onClick={() => setInnerTab("newCustomer")}
//                     >
//                       New Customer
//                     </button>
//                     <button
//                       className={`px-3 py-1 rounded-lg ${
//                         innerTab === "existingCustomer"
//                           ? "bg-blue-100 font-semibold"
//                           : "hover:bg-gray-100 text-gray-600"
//                       }`}
//                       onClick={() => setInnerTab("existingCustomer")}
//                     >
//                       Existing Customer
//                     </button>
//                   </div>

//                   {innerTab === "newCustomer" && <CustomerRegistrationPage />}
//                   {innerTab === "existingCustomer" && <ExistingCustomerLoan />}
//                 </div>
//               )}

//               {subTab === "existingLoan" && <ExistingLoanLatest />}
//               {subTab === "pledgeDetails" && (
//                 <div>Loan feature coming soon...</div>
//               )}
//               {subTab === "interestCalculator" && (
//                 <div>Another loan feature coming soon...</div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
