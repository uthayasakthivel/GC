// utils/getNextMeltingSheetNumber.js
import MeltingSheet from "../models/MeltingSheet.js";

export const getNextMeltingSheetNumber = async () => {
  const sheets = await MeltingSheet.find({}, "sheetNumber").lean();

  const usedNumbers = new Set(
    sheets
      .map((s) => parseInt(s.sheetNumber?.split("-")[1]))
      .filter((n) => !isNaN(n))
  );

  let next = 1;
  while (usedNumbers.has(next)) {
    next++;
  }

  return `GM-${String(next).padStart(3, "0")}`;
};
