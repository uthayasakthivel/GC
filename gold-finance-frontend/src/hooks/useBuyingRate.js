// hooks/useBuyingRate.js
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useBuyingRate = (is916HM) => {
  const [rate, setRate] = useState("");
  const [purity, setPurity] = useState("");

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axiosInstance.get("/admin/config/rates/buying");
        const newRate = is916HM ? res.data.gold22k916 : res.data.gold22k;
        setRate(newRate);
        setPurity(is916HM ? 916 : "");
      } catch (err) {
        console.error("Rate fetch error", err);
      }
    };

    if (is916HM !== null) {
      fetchRate();
    }
  }, [is916HM]);

  return { rate, purity };
};
