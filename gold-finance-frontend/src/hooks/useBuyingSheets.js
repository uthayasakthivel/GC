import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useBuyingSheets = () => {
  const [buyingSheets, setBuyingSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuyingSheets = async () => {
    try {
      const res = await axiosInstance.get("/sheet/buying-sheet");
      console.log(res.data, "use buying sheets data");
      setBuyingSheets(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch buying sheets:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyingSheets();
  }, []);

  return { buyingSheets, loading, error, refetch: fetchBuyingSheets };
};
