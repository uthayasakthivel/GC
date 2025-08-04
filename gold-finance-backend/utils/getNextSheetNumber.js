// utils/getNextSheetNumber.js
import BuyingSheet from "../models/BuyingSheet.js";

export const getNextSheetNumber = async () => {
  const sheets = await BuyingSheet.find({}, "sheetNumber").lean();

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
