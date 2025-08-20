// utils/getNextLoanId.js
import Loan from "../models/Loan.js";

export const getNextLoanId = async (branchCode) => {
  const regex = new RegExp(`^${branchCode}\\d+$`);

  const lastLoan = await Loan.find({ loanId: { $regex: regex } })
    .sort({ loanId: -1 })
    .limit(1);

  let nextNumber = "001";

  if (lastLoan.length) {
    const lastIdNum = parseInt(lastLoan[0].loanId.replace(branchCode, ""));
    nextNumber = String(lastIdNum + 1).padStart(3, "0");
  }

  return `${branchCode}${nextNumber}`;
};
