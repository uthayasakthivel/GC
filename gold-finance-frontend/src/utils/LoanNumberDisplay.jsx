import React from "react";
import { useLoan } from "../context/LoanContext";

function LoanNumberDisplay() {
  const { nextLoanNumber, nextLoanNumberLoading } = useLoan();
  console.log("came loan number display");
  console.log("LoanDetailsForm received in display:", nextLoanNumber);

  if (nextLoanNumberLoading) return <div>Loading...</div>;
  return <div>Next Loan Number: {nextLoanNumber}</div>;
}

export default LoanNumberDisplay;
