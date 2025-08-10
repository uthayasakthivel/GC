import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export default function useSheetDetails(sheetType, id) {
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(sheetType, "sheettype");
  useEffect(() => {
    if (!sheetType || !id) return;

    const fetchSheet = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/sheet/${sheetType}-sheet/${id}`);
        setSheet(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSheet();
  }, [sheetType, id]);

  return { sheet, loading, error };
}
