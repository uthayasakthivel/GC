import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useDashboardData } from "../hooks/useDashboardData";

export default function RateSetter() {
  const [todayRates, setTodayRates] = useState({
    gold22k: 0,
    gold24k: 0,
    silver: 0,
  });
  const [buyingRates, setBuyingRates] = useState({
    gold22k916: 0,
    gold22k: 0,
    silver: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { refetch } = useDashboardData();

  const fetchRates = async () => {
    setLoading(true);
    try {
      const [todayRes, buyingRes] = await Promise.all([
        axios.get("/admin/config/rates/today"),
        axios.get("/admin/config/rates/buying"),
      ]);
      setTodayRates(todayRes.data);
      setBuyingRates(buyingRes.data);
      refetch();
      setError(null);
    } catch {
      setError("Failed to load rates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleChangeToday = (e) => {
    setTodayRates({ ...todayRates, [e.target.name]: Number(e.target.value) });
  };
  const handleChangeBuying = (e) => {
    setBuyingRates({ ...buyingRates, [e.target.name]: Number(e.target.value) });
  };

  const handleSaveToday = async () => {
    setSaving(true);
    try {
      await axios.post("/admin/config/rates/today", todayRates);
      setError(null);
      alert("Today's rates updated");
    } catch {
      setError("Failed to update today's rates");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBuying = async () => {
    setSaving(true);
    try {
      await axios.post("/admin/config/rates/buying", buyingRates);
      setError(null);
      alert("Buying rates updated");
    } catch {
      setError("Failed to update buying rates");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading rates...</p>;

  return (
    <div className="mb-8 max-w-lg">
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <h3 className="font-bold text-lg mb-2">Set Today's Rates</h3>
      <div className="space-y-2 mb-4">
        <input
          type="number"
          name="gold22k"
          value={todayRates.gold22k}
          onChange={handleChangeToday}
          placeholder="Gold 22k"
          className="input"
        />
        <input
          type="number"
          name="gold24k"
          value={todayRates.gold24k}
          onChange={handleChangeToday}
          placeholder="Gold 24k"
          className="input"
        />
        <input
          type="number"
          name="silver"
          value={todayRates.silver}
          onChange={handleChangeToday}
          placeholder="Silver"
          className="input"
        />
        <button
          onClick={handleSaveToday}
          disabled={saving}
          className="btn btn-primary"
        >
          Save Today's Rates
        </button>
      </div>

      <h3 className="font-bold text-lg mb-2">Set Buying Rates</h3>
      <div className="space-y-2 mb-4">
        <input
          type="number"
          name="gold22k916"
          value={buyingRates.gold22k916}
          onChange={handleChangeBuying}
          placeholder="Gold 22k 916"
          className="input"
        />
        <input
          type="number"
          name="gold22k"
          value={buyingRates.gold22k}
          onChange={handleChangeBuying}
          placeholder="Gold 22k"
          className="input"
        />
        <input
          type="number"
          name="silver"
          value={buyingRates.silver}
          onChange={handleChangeBuying}
          placeholder="Silver"
          className="input"
        />
        <button
          onClick={handleSaveBuying}
          disabled={saving}
          className="btn btn-primary"
        >
          Save Buying Rates
        </button>
      </div>
    </div>
  );
}
