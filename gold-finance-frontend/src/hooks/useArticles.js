// hooks/useArticles.js
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const res = await axiosInstance.get("/admin/config/jewellery");
      setArticles(res.data);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return { articles, loading, refetchArticles: fetchArticles };
};
