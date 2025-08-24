// import { useState, useEffect } from "react";
// import LoanInterestRateSelector from "../utils/LoanInterestRateSelector";
// import { useLoan } from "../context/LoanContext";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const LoanDetailsForm = () => {
//   const {
//     nextLoanNumber,
//     nextLoanNumberLoading,
//     loanAmount,
//     allInterestRates,
//     selectedInterestRate,
//   } = useLoan();

//   // Helper: Safe add months
//   function addMonths(date, months) {
//     let d = new Date(date);
//     let day = d.getDate();
//     d.setMonth(d.getMonth() + months);
//     // Fix overflowed months (e.g., Jan 31 + 1 month → Mar 3)
//     if (d.getDate() < day) {
//       d.setDate(0);
//     }
//     return d;
//   }

//   // Helper: Format DD/MM/YYYY
//   function formatDate(date) {
//     if (!date) return "";
//     let d = new Date(date);
//     let day = String(d.getDate()).padStart(2, "0");
//     let month = String(d.getMonth() + 1).padStart(2, "0");
//     let year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   }

//   const [loanPeriod, setLoanPeriod] = useState(12); // Months
//   const [loanDate, setLoanDate] = useState(new Date());
//   const [dueDate, setDueDate] = useState(null);
//   const [noOfDays, setNoOfDays] = useState(0);

//   // Calculate due date on first render and on change
//   useEffect(() => {
//     if (loanDate && loanPeriod) {
//       alert(2);
//       let d = addMonths(loanDate, loanPeriod);
//       d.setDate(d.getDate() - 1); // Subtract one day
//       setDueDate(d);
//     }
//   }, [loanDate, loanPeriod]);

//   // Calculate number of days
//   useEffect(() => {
//     if (loanDate && dueDate) {
//       let diffTime = dueDate.getTime() - loanDate.getTime();
//       let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       setNoOfDays(days);
//     }
//   }, [loanDate, dueDate]);

//   if (nextLoanNumberLoading) return <div>Loading...</div>;

//   return (
//     <div className="p-4 border rounded-md space-y-4">
//       <p>
//         <strong>Next Loan Number:</strong> {nextLoanNumber}
//       </p>

//       {/* Loan Amount */}
//       <div>
//         <label className="block font-semibold">Loan Amount:</label>
//         <input
//           type="number"
//           value={loanAmount}
//           readOnly
//           className="border px-2 py-1 rounded w-full"
//         />
//       </div>

//       {/* Loan Period */}
//       <div>
//         <label className="block font-semibold">Loan Period (Months):</label>
//         <select
//           value={loanPeriod}
//           onChange={(e) => setLoanPeriod(Number(e.target.value))}
//           className="border px-2 py-1 rounded w-full"
//         >
//           <option value={6}>6 Months</option>
//           <option value={9}>9 Months</option>
//           <option value={12}>12 Months</option>
//         </select>
//       </div>

//       {/* Interest Rate Selector */}
//       <div>
//         <label className="block font-semibold">Interest Rate:</label>
//         <LoanInterestRateSelector />
//       </div>

//       {/* Loan Date (show DatePicker) */}
//       <div>
//         <label className="block font-semibold">Loan Date:</label>
//         <DatePicker
//           selected={loanDate}
//           onChange={(date) => setLoanDate(date)}
//           dateFormat="dd/MM/yyyy"
//           className="border px-2 py-1 rounded w-full"
//         />
//       </div>

//       {/* Loan Due Date (auto calculated, read only—not a DatePicker) */}
//       <div>
//         <label className="block font-semibold">Loan Due Date:</label>
//         <input
//           type="text"
//           value={dueDate ? formatDate(dueDate) : ""}
//           readOnly
//           className="border px-2 py-1 rounded w-full bg-gray-100"
//         />
//       </div>

//       {/* No. of Days */}
//       <div>
//         <label className="block font-semibold">No. of Days:</label>
//         <input
//           type="number"
//           value={noOfDays}
//           readOnly
//           className="border px-2 py-1 rounded w-full"
//         />
//       </div>
//     </div>
//   );
// };

// export default LoanDetailsForm;
