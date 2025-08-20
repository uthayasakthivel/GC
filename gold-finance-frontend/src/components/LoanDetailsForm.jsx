import React from "react";
import LoanNumberDisplay from "../utils/LoanNumberDisplay";
import LoanNumberSelector from "../utils/LoanNumberSelector";

const LoanDetailsForm = ({ selectedBranch }) => {
  console.log("LoanDetailsForm received:", selectedBranch);
  return (
    <div>
      <LoanNumberDisplay selectedBranch={selectedBranch} />
      <LoanNumberSelector />
    </div>
  );
};

export default LoanDetailsForm;
