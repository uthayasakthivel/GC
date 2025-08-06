// hooks/useNextSheetNumber.js
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useNextSheetNumber = () => {
  const [nextSheetNumber, setNextSheetNumber] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNextSheetNumber = async () => {
    try {
      const res = await axiosInstance.get("/sheet/buying-sheet/next-number");
      setNextSheetNumber(res.data.next);
    } catch (err) {
      console.error("Error fetching next sheet number:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextSheetNumber();
  }, []);

  return { nextSheetNumber, loading, refetchNextNumber: fetchNextSheetNumber };
};
