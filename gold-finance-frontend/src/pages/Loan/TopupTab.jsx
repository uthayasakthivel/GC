// import React, { useState, useMemo } from "react";
// import { useLoan } from "../../context/LoanContext";

// export default function TopupTab({ loan, currentRatePerGram }) {
//   const { singleLoan, noOfDaysLoan, setSingleLoan, interestToPay } = useLoan();

//   // Old totals
//   const totalOriginalEligible = useMemo(
//     () =>
//       loan.jewels?.reduce((sum, j) => sum + (Number(j.eligibleAmount) || 0), 0),
//     [loan.jewels]
//   );

//   // Recalculate with new ratePerGram
//   const updatedJewels = useMemo(() => {
//     return (loan.jewels || []).map((j) => {
//       const updatedRate = currentRatePerGram;
//       const updatedEligibleAmount = (Number(j.netWeight) || 0) * updatedRate;
//       const updatedPartial =
//         ((Number(j.partial) || 0) / (Number(j.ratePerGram) || 1)) * updatedRate;

//       return {
//         ...j,
//         updatedRatePerGram: updatedRate,
//         updatedEligibleAmount,
//         updatedPartial,
//       };
//     });
//   }, [loan.jewels, currentRatePerGram]);

//   const totalUpdatedEligible = useMemo(
//     () =>
//       updatedJewels.reduce(
//         (sum, j) => sum + (Number(j.updatedEligibleAmount) || 0),
//         0
//       ),
//     [updatedJewels]
//   );

//   const [showTopupForm, setShowTopupForm] = useState(false);
//   const [enteredTopup, setEnteredTopup] = useState(""); // local input for user top-up entry

//   // New total eligible amount
//   const newTotalEligible = totalUpdatedEligible;

//   // Top-up Amount calculated live
//   const topupAmount = useMemo(() => {
//     const loanVal = Number(singleLoan?.loanAmount || 0);
//     const interest = Number(interestToPay || 0);
//     return newTotalEligible - loanVal - interest;
//   }, [singleLoan?.loanAmount, newTotalEligible, interestToPay]);

//   return (
//     <div className="p-4 bg-gray-50 rounded shadow">
//       <h3 className="text-lg font-bold mb-2">Top-up Eligibility</h3>

//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2 border">Ornament</th>
//             <th className="p-2 border">No. of Items</th>
//             <th className="p-2 border">Gross Weight</th>
//             <th className="p-2 border">Net Weight</th>
//             <th className="p-2 border">New Rate/Gram</th>
//             <th className="p-2 border">New Eligible Amt</th>
//             <th className="p-2 border">New Partial</th>
//           </tr>
//         </thead>
//         <tbody>
//           {updatedJewels.map((jewel, idx) => (
//             <tr key={idx}>
//               <td className="p-2 border">{jewel.ornament}</td>
//               <td className="p-2 border">{jewel.numItems}</td>
//               <td className="p-2 border">{jewel.grossWeight}</td>
//               <td className="p-2 border">{jewel.netWeight}</td>
//               <td className="p-2 border">{jewel.updatedRatePerGram}</td>
//               <td className="p-2 border">
//                 {jewel.updatedEligibleAmount.toFixed(2)}
//               </td>
//               <td className="p-2 border">{jewel.updatedPartial.toFixed(2)}</td>
//             </tr>
//           ))}

//           {/* Totals row */}
//           <tr className="bg-blue-100 font-semibold">
//             <td className="p-2 border">Totals</td>
//             <td className="p-2 border">
//               {loan.jewels.reduce((sum, j) => sum + Number(j.numItems || 0), 0)}
//             </td>
//             <td className="p-2 border">
//               {loan.jewels.reduce(
//                 (sum, j) => sum + Number(j.grossWeight || 0),
//                 0
//               )}
//             </td>
//             <td className="p-2 border">
//               {loan.jewels.reduce(
//                 (sum, j) => sum + Number(j.netWeight || 0),
//                 0
//               )}
//             </td>
//             <td className="p-2 border"></td>
//             <td className="p-2 border">{totalUpdatedEligible.toFixed(2)}</td>
//             <td className="p-2 border"></td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Old / New / Top-up Amount */}
//       <div className="mt-4 p-2 bg-gray-200 rounded">
//         <p>Old Total Eligible Amount: {totalOriginalEligible.toFixed(2)}</p>
//         <p>New Total Eligible Amount: {newTotalEligible.toFixed(2)}</p>
//         <p>Loan Taken: {Number(singleLoan?.loanAmount || 0).toFixed(2)}</p>
//         <p>Interest Needs to Pay: {Number(interestToPay || 0).toFixed(2)}</p>
//         <p>Top-up Amount Available: {topupAmount.toFixed(2)}</p>
//       </div>

//       {/* Top-up Button */}
//       <button
//         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         onClick={() => setShowTopupForm(true)}
//       >
//         Top-up
//       </button>

//       {/* Top-up Form */}
//       {showTopupForm && (
//         <form
//           className="mt-4 p-4 border rounded bg-gray-100"
//           onSubmit={(e) => {
//             e.preventDefault();
//             const entered = Number(enteredTopup || 0);

//             if (entered > topupAmount) {
//               alert(`Top-up amount cannot exceed ${topupAmount.toFixed(2)}`);
//               return;
//             }

//             // update loan amount in singleLoan object: old + entered topup
//             const newLoan = Number(singleLoan?.loanAmount || 0) + entered;
//             setSingleLoan((prev) => ({
//               ...prev,
//               loanAmount: newLoan,
//             }));

//             alert(`Loan amount updated to ₹${newLoan.toFixed(2)}`);
//             setEnteredTopup(""); // clear input box
//           }}
//         >
//           <label className="block mb-2 font-semibold">
//             Enter Top-up Amount (max {topupAmount.toFixed(2)}):
//           </label>
//           <input
//             type="number"
//             className="border p-2 rounded w-full mb-2"
//             value={enteredTopup}
//             onChange={(e) => setEnteredTopup(e.target.value)}
//             max={topupAmount}
//             min="0"
//             step="0.01"
//             required
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Submit
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

import React, { useState, useMemo } from "react";
import { useLoan } from "../../context/LoanContext";

export default function TopupTab({ loan, currentRatePerGram }) {
  const { singleLoan, noOfDaysLoan, setSingleLoan, interestToPay } = useLoan();

  // Old totals
  const totalOriginalEligible = useMemo(
    () =>
      loan.jewels?.reduce((sum, j) => sum + (Number(j.eligibleAmount) || 0), 0),
    [loan.jewels]
  );

  // Recalculate with new ratePerGram
  const updatedJewels = useMemo(() => {
    return (loan.jewels || []).map((j) => {
      const updatedRate = currentRatePerGram;
      const updatedEligibleAmount = (Number(j.netWeight) || 0) * updatedRate;
      const updatedPartial =
        ((Number(j.partial) || 0) / (Number(j.ratePerGram) || 1)) * updatedRate;

      return {
        ...j,
        updatedRatePerGram: updatedRate,
        updatedEligibleAmount,
        updatedPartial,
      };
    });
  }, [loan.jewels, currentRatePerGram]);

  const totalUpdatedEligible = useMemo(
    () =>
      updatedJewels.reduce(
        (sum, j) => sum + (Number(j.updatedEligibleAmount) || 0),
        0
      ),
    [updatedJewels]
  );

  const [showTopupForm, setShowTopupForm] = useState(false);
  const [enteredTopup, setEnteredTopup] = useState(""); // local input for user top-up entry

  // New total eligible amount
  const newTotalEligible = totalUpdatedEligible;

  // Top-up Amount calculated live
  const topupAmount = useMemo(() => {
    const loanVal = Number(singleLoan?.loanAmount || 0);
    const interest = Number(interestToPay || 0);
    return newTotalEligible - loanVal - interest;
  }, [singleLoan?.loanAmount, newTotalEligible, interestToPay]);

  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <h3 className="text-lg font-bold mb-2">Top-up Eligibility</h3>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Ornament</th>
            <th className="p-2 border">No. of Items</th>
            <th className="p-2 border">Gross Weight</th>
            <th className="p-2 border">Net Weight</th>
            <th className="p-2 border">New Rate/Gram</th>
            <th className="p-2 border">New Eligible Amt</th>
            <th className="p-2 border">New Partial</th>
          </tr>
        </thead>
        <tbody>
          {updatedJewels.map((jewel, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{jewel.ornament}</td>
              <td className="p-2 border">{jewel.numItems}</td>
              <td className="p-2 border">{jewel.grossWeight}</td>
              <td className="p-2 border">{jewel.netWeight}</td>
              <td className="p-2 border">{jewel.updatedRatePerGram}</td>
              <td className="p-2 border">
                {jewel.updatedEligibleAmount.toFixed(2)}
              </td>
              <td className="p-2 border">{jewel.updatedPartial.toFixed(2)}</td>
            </tr>
          ))}

          {/* Totals row */}
          <tr className="bg-blue-100 font-semibold">
            <td className="p-2 border">Totals</td>
            <td className="p-2 border">
              {loan.jewels.reduce((sum, j) => sum + Number(j.numItems || 0), 0)}
            </td>
            <td className="p-2 border">
              {loan.jewels.reduce(
                (sum, j) => sum + Number(j.grossWeight || 0),
                0
              )}
            </td>
            <td className="p-2 border">
              {loan.jewels.reduce(
                (sum, j) => sum + Number(j.netWeight || 0),
                0
              )}
            </td>
            <td className="p-2 border"></td>
            <td className="p-2 border">{totalUpdatedEligible.toFixed(2)}</td>
            <td className="p-2 border"></td>
          </tr>
        </tbody>
      </table>

      {/* Old / New / Top-up Amount */}
      <div className="mt-4 p-2 bg-gray-200 rounded">
        <p>Old Total Eligible Amount: {totalOriginalEligible.toFixed(2)}</p>
        <p>New Total Eligible Amount: {newTotalEligible.toFixed(2)}</p>
        <p>Loan Taken: {Number(singleLoan?.loanAmount || 0).toFixed(2)}</p>
        <p>Interest Needs to Pay: {Number(interestToPay || 0).toFixed(2)}</p>
        <p>Top-up Amount Available: {topupAmount.toFixed(2)}</p>
        <p>
          Last Interest Paid On:{" "}
          {singleLoan?.lastInterestPaidDate
            ? new Date(singleLoan.lastInterestPaidDate).toLocaleDateString(
                "en-GB"
              )
            : "-"}
        </p>
      </div>

      {/* Top-up Button */}
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowTopupForm(true)}
      >
        Top-up
      </button>

      {/* Top-up Form */}
      {showTopupForm && (
        <form
          className="mt-4 p-4 border rounded bg-gray-100"
          onSubmit={(e) => {
            e.preventDefault();
            const entered = Number(enteredTopup || 0);

            if (entered > topupAmount) {
              alert(`Top-up amount cannot exceed ${topupAmount.toFixed(2)}`);
              return;
            }

            // New loan = old loan + interestToPay + entered topup
            const newLoan =
              Number(singleLoan?.loanAmount || 0) +
              Number(interestToPay || 0) +
              entered;

            // update singleLoan with new loan amount + new interest date
            setSingleLoan((prev) => ({
              ...prev,
              loanAmount: newLoan,
              lastInterestPaidDate: new Date().toISOString(),
            }));

            alert(
              `Loan amount updated to ₹${newLoan.toFixed(
                2
              )} and interest date updated`
            );
            setEnteredTopup(""); // clear input box
          }}
        >
          <label className="block mb-2 font-semibold">
            Enter Top-up Amount (max {topupAmount.toFixed(2)}):
          </label>
          <input
            type="number"
            className="border p-2 rounded w-full mb-2"
            value={enteredTopup}
            onChange={(e) => setEnteredTopup(e.target.value)}
            max={topupAmount}
            min="0"
            step="0.01"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
