import { getNextLoanId } from "../utils/getNextLoanId.js";

export const getNextLoanIdApi = async (req, res) => {
  try {
    const branchCode = req.query.branchCode;
    if (!branchCode) {
      return res
        .status(400)
        .json({ message: "branchCode query parameter is required" });
    }

    const nextLoanId = await getNextLoanId(branchCode);
    res.json({ loanId: nextLoanId });
  } catch (err) {
    console.error("getNextLoanIdApi error:", err);
    res.status(500).json({ message: "Failed to get next loan ID" });
  }
};
