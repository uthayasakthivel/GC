// hooks/useBranches.js
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const res = await axiosInstance.get("/admin/config/branches");
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return { branches, loading, refetchBranches: fetchBranches };
};
