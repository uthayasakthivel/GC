import React from "react";
import { useNextLoanNumber } from "../hooks/useNextLoanNumber";

function LoanNumberDisplay({ selectedBranch: branchCode }) {
  console.log("came loan number display");
  console.log("LoanDetailsForm received in display:", branchCode);

  const { nextLoanNumber, loading } = useNextLoanNumber(branchCode);

  if (loading) return <div>Loading...</div>;
  return <div>Next Loan Number: {nextLoanNumber}</div>;
}

export default LoanNumberDisplay;
