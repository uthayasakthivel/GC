import React, { useState } from "react";
import axios from "../api/axiosInstance";

export default function OpeningBalanceForm({ onBalanceUpdated }) {
  const [cash, setCash] = useState("");
  const [goldGrams, setGoldGrams] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate cash and goldGrams
    if (
      (cash === "" || isNaN(Number(cash))) &&
      (goldGrams === "" || isNaN(Number(goldGrams)))
    ) {
      setError("Enter a valid cash or gold grams amount");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/admin/config/opening-balance/add", {
        cash: Number(cash) || 0,
        goldGrams: Number(goldGrams) || 0,
      });
      setError(null);
      setCash("");
      setGoldGrams("");
      alert("Opening balance updated");
      onBalanceUpdated?.();
    } catch {
      setError("Failed to update opening balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mb-8">
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <label className="block mb-2 font-semibold">
        Add Cash to Opening Balance
      </label>
      <input
        type="number"
        value={cash}
        onChange={(e) => setCash(e.target.value)}
        placeholder="Cash Amount"
        className="input mb-4"
        min="0"
        step="0.01"
      />

      <label className="block mb-2 font-semibold">
        Add Gold (grams) to Opening Balance
      </label>
      <input
        type="number"
        value={goldGrams}
        onChange={(e) => setGoldGrams(e.target.value)}
        placeholder="Gold Grams"
        className="input mb-4"
        min="0"
        step="0.01"
      />

      <button disabled={loading} type="submit" className="btn btn-primary">
        Add Balance
      </button>
    </form>
  );
}
