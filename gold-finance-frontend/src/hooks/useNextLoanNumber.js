import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useNextLoanNumber = (selectedBranch) => {
  const branchCodeValue = selectedBranch?.code; // safe access
  const [nextLoanNumber, setNextLoanNumber] = useState("");
  const [nextLoanNumberLoading, setLoading] = useState(true);

  const fetchNextLoanNumber = async () => {
    if (!branchCodeValue) return; // ensure code exists
    setLoading(true);
    try {
      const res = await axiosInstance.get("loan/next-id", {
        params: { branchCode: branchCodeValue }, // key matches backend
      });
      setNextLoanNumber(res.data.loanId || "");
    } catch (err) {
      console.error("Error fetching next loan number:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextLoanNumber();
  }, [branchCodeValue]);

  return {
    nextLoanNumber,
    nextLoanNumberLoading,
    refetchNextLoanNumber: fetchNextLoanNumber,
  };
};
