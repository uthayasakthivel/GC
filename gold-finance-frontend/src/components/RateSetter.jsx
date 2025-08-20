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
  const [loanRate, setLoanRate] = useState({ ratePerGram: 0, notes: "" });

  const [interestRate, setInterestRate] = useState({
    price: "",
    percentage: "",
    factor: "",
  });

  // Store fetched interest rates list
  const [interestRatesList, setInterestRatesList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { refetch } = useDashboardData();

  // Fetch all rates including interest rates
  const fetchRates = async () => {
    setLoading(true);
    try {
      const [todayRes, buyingRes, loanRes, interestRes] = await Promise.all([
        axios.get("/admin/config/rates/today"),
        axios.get("/admin/config/rates/buying"),
        axios.get("/admin/config/today-gold-loan-rate"),
        axios.get("/admin/config/interest-rates"), // Fetch all interest rates
      ]);

      setTodayRates(todayRes.data);
      setBuyingRates(buyingRes.data);
      setLoanRate(loanRes.data);
      setInterestRatesList(interestRes.data); // Set list

      setError(null);
      refetch();
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
  const handleChangeLoan = (e) => {
    setLoanRate({ ...loanRate, [e.target.name]: e.target.value });
  };

  const handleChangeInterest = (e) => {
    setInterestRate({ ...interestRate, [e.target.name]: e.target.value });
  };

  const handleSaveToday = async () => {
    setSaving(true);
    try {
      await axios.post("/admin/config/rates/today", todayRates);
      setError(null);
      alert("Today's rates updated");
      refetch();
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
      refetch();
    } catch {
      setError("Failed to update buying rates");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLoan = async () => {
    setSaving(true);
    try {
      await axios.put("/admin/config/today-gold-loan-rate", loanRate);
      setError(null);
      alert("Loan rate updated");
      refetch();
    } catch {
      setError("Failed to update loan rate");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInterest = async () => {
    setSaving(true);
    try {
      const payload = {
        price: Number(interestRate.price),
        percentage: Number(interestRate.percentage),
        factor: Number(interestRate.factor),
      };

      if (
        isNaN(payload.price) ||
        isNaN(payload.percentage) ||
        isNaN(payload.factor)
      ) {
        setError("Please enter valid numbers for all interest rate fields.");
        setSaving(false);
        return;
      }

      await axios.post("/admin/config/interest-rates", payload);
      setError(null);
      alert("Interest rate added");
      setInterestRate({ price: "", percentage: "", factor: "" });
      fetchRates(); // Refresh list after adding
    } catch {
      setError("Failed to add interest rate");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading rates...</p>;

  return (
    <div className="mb-8 max-w-lg">
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Today’s Rates */}
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

      {/* Buying Rates */}
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

      {/* Loan Rate */}
      <h3 className="font-bold text-lg mb-2">Set Today’s Gold Loan Rate</h3>
      <div className="space-y-2 mb-4">
        <input
          type="number"
          name="ratePerGram"
          value={loanRate.ratePerGram || ""}
          onChange={handleChangeLoan}
          placeholder="Rate per gram"
          className="input"
        />
        <input
          type="text"
          name="notes"
          value={loanRate.notes || ""}
          onChange={handleChangeLoan}
          placeholder="Notes (optional)"
          className="input"
        />
        <button
          onClick={handleSaveLoan}
          disabled={saving}
          className="btn btn-primary"
        >
          Save Loan Rate
        </button>
      </div>

      {/* Interest Rate */}
      <h3 className="font-bold text-lg mb-2">Add Interest Rate</h3>
      <div className="space-y-2 mb-4">
        <input
          type="number"
          name="price"
          value={interestRate.price}
          onChange={handleChangeInterest}
          placeholder="Price (e.g. 1.5)"
          className="input"
          step="0.01"
        />
        <input
          type="number"
          name="percentage"
          value={interestRate.percentage}
          onChange={handleChangeInterest}
          placeholder="Percentage (e.g. 18)"
          className="input"
          step="0.01"
        />
        <input
          type="number"
          name="factor"
          value={interestRate.factor}
          onChange={handleChangeInterest}
          placeholder="Factor (e.g. 0.0005)"
          className="input"
          step="0.00001"
        />
        <button
          onClick={handleSaveInterest}
          disabled={saving}
          className="btn btn-primary"
        >
          Save Interest Rate
        </button>
      </div>

      {/* Show all interest rates */}
      <h3 className="font-bold text-lg mb-2">All Interest Rates</h3>
      {interestRatesList.length === 0 ? (
        <p>No interest rates found.</p>
      ) : (
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Percentage (%)</th>
              <th className="border px-2 py-1">Factor</th>
              <th className="border px-2 py-1">Created At</th>
            </tr>
          </thead>
          <tbody>
            {interestRatesList.map((rate) => (
              <tr key={rate._id}>
                <td className="border px-2 py-1 text-center">{rate.price}</td>
                <td className="border px-2 py-1 text-center">
                  {rate.percentage}
                </td>
                <td className="border px-2 py-1 text-center">{rate.factor}</td>
                <td className="border px-2 py-1 text-center">
                  {new Date(rate.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
