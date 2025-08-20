import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
export const useNextLoanNumber = (branchCode) => {
  const branchCodeValue = branchCode?.code; // safe access

  const [nextLoanNumber, setNextLoanNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNextLoanNumber = async () => {
    if (!branchCodeValue) {
      setNextLoanNumber("");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get("/loan/next-id", {
        params: { branchCode: branchCodeValue },
      });
      // 🔥 match the backend response key
      setNextLoanNumber(res.data.nextLoanNumber || res.data.loanId || "");
      console.log(nextLoanNumber, "nln");
    } catch (err) {
      console.error("Error fetching next loan number:", err);
      setNextLoanNumber("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextLoanNumber();
  }, [branchCodeValue]);

  return {
    nextLoanNumber,
    loading,
    refetchNextLoanNumber: fetchNextLoanNumber,
  };
};
