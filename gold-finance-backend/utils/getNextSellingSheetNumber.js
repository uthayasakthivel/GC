// utils/getNextSellingSheetNumber.js
import SellingSheet from "../models/SellingSheet.js";

export const getNextSellingSheetNumber = async () => {
  const sheets = await SellingSheet.find({}, "sheetNumber").lean();

  const usedNumbers = new Set(
    sheets
      .map((s) => parseInt(s.sheetNumber?.split("-")[1]))
      .filter((n) => !isNaN(n))
  );

  let next = 1;
  while (usedNumbers.has(next)) {
    next++;
  }

  return `GS-${String(next).padStart(3, "0")}`;
};
