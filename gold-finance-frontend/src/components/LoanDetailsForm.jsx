import React from "react";
import LoanNumberDisplay from "../utils/LoanNumberDisplay";
import LoanNumberSelector from "../utils/LoanNumberSelector";

const LoanDetailsForm = () => {
  return (
    <div>
      <LoanNumberDisplay />
      <LoanNumberSelector />
    </div>
  );
};

export default LoanDetailsForm;
