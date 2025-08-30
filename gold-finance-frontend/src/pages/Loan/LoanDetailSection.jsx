import React from "react";
import { useLoan } from "../../context/LoanContext";

const LoanDetailSection = () => {
  const { singleLoan, noOfDaysLoan, interestToPay } = useLoan();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 underline">Loan Details</h2>
      <p>
        <strong>Loan ID:</strong> {singleLoan.loanId}
      </p>
      <p>
        <strong>Loan Amount:</strong> ₹{singleLoan.loanAmount}
      </p>
      <p>
        <strong>Loan Duration:</strong> {singleLoan.loanPeriod} Months
      </p>
      <p>
        <strong>Factor:</strong> {singleLoan.selectedFactor}
      </p>
      <p>
        <strong>Loan Date:</strong>{" "}
        {new Date(singleLoan.loanDate).toLocaleDateString("en-GB")}
      </p>
      <p>
        <strong>Loan Due Date:</strong>{" "}
        {new Date(singleLoan.dueDate).toLocaleDateString("en-GB")}
      </p>
      <p>
        <strong>Today:</strong> {new Date().toLocaleDateString("en-GB")}
      </p>
      <p>
        <strong>Last Interest Paid On:</strong>{" "}
        {singleLoan?.lastInterestPaidDate
          ? new Date(singleLoan.lastInterestPaidDate).toLocaleDateString(
              "en-GB"
            )
          : "Not paid yet"}
      </p>

      <p>
        <strong>No. of Days:</strong> {noOfDaysLoan}
      </p>

      <p>
        <strong>Interest Needs to Pay:</strong> ₹{interestToPay.toFixed(2)}
      </p>
    </div>
  );
};

export default LoanDetailSection;
