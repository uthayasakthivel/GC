import Loan from "../models/Loan.js";

export const getNextLoanId = async (branchCode) => {
  if (!branchCode) {
    throw new Error("Branch code is required");
  }

  // Regex to match: MDRGL001, MDRGL002, etc.
  const regex = new RegExp(`^${branchCode}GL\\d+$`);

  const lastLoan = await Loan.find({ loanId: { $regex: regex } })
    .sort({ loanId: -1 })
    .limit(1);

  let nextNumber = "001";

  if (lastLoan.length) {
    const lastIdNum = parseInt(
      lastLoan[0].loanId.replace(`${branchCode}GL`, "")
    );
    nextNumber = String(lastIdNum + 1).padStart(3, "0");
  }

  return `${branchCode}GL${nextNumber}`;
};
