import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useNextSheetNumber = (TypeOfSheet = "BuyingSheet") => {
  const [nextSheetNumber, setNextSheetNumber] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNextSheetNumber = async () => {
    try {
      const endpoint =
        TypeOfSheet === "BuyingSheet"
          ? "/sheet/buying-sheet/next-number"
          : TypeOfSheet === "SellingSheet"
          ? "/sheet/selling-sheet/next-number"
          : TypeOfSheet === "MeltingSheet"
          ? "/sheet/melting-sheet/next-number"
          : TypeOfSheet === "FinanceSheet"
          ? "/sheet/finance-sheet/next-number"
          : "/sheet/buying-sheet/next-number"; // fallback default

      console.log(endpoint, "endpoint");
      const res = await axiosInstance.get(endpoint);
      console.log(res);
      setNextSheetNumber(res.data.next);
    } catch (err) {
      console.error("Error fetching next sheet number:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextSheetNumber();
  }, [TypeOfSheet]);

  return { nextSheetNumber, loading, refetchNextNumber: fetchNextSheetNumber };
};
