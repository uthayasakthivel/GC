// utils/getNextFinanceSheetNumber.js
import FinanceSheet from "../models/FinanceSheet.js";

export const getNextFinanceSheetNumber = async () => {
  const sheets = await FinanceSheet.find({}, "sheetNumber").lean();

  const usedNumbers = new Set(
    sheets
      .map((s) => parseInt(s.sheetNumber?.split("-")[1]))
      .filter((n) => !isNaN(n))
  );

  let next = 1;
  while (usedNumbers.has(next)) {
    next++;
  }

  return `GF-${String(next).padStart(3, "0")}`;
};
