import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "../api/axiosInstance";

export default function BuyingSheet() {
  // State for fetched data
  const [branches, setBranches] = useState([]);
  const [buyingRate, setBuyingRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [branch, setBranch] = useState("");
  const [sheetNo, setSheetNo] = useState("GB-1");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [stoneWeight, setStoneWeight] = useState("");
  const [is916HM, setIs916HM] = useState(null);
  const [purity, setPurity] = useState("");

  const [mode, setMode] = useState("offline");
  const [refName, setRefName] = useState("");
  const [refMobile, setRefMobile] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("");
  const [misc, setMisc] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

  const [files, setFiles] = useState({
    article: null,
    adhar: null,
    bankPledge: null,
    declaration: null,
  });

  const token = localStorage.getItem("token");

  // Fetch branches and rates on mount
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        setError(null);

        const branchesRes = await axios.get("/admin/config/branches");
        const branchesData = branchesRes.data;

        const rateRes = await axios.get("/admin/config/rates/today");
        const rateData = rateRes.data;

        setBranches(branchesData || []);
        setBranch(branchesData.branches?.[0]?._id || ""); // corrected key for ID
        setBuyingRate(rateData.buyingRate || null);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // Derived/calculated values
  const netWeightCalc =
    parseFloat(grossWeight || 0) - parseFloat(stoneWeight || 0);
  const netWeightFixed =
    netWeightCalc > 0 ? netWeightCalc.toFixed(4) : "0.0000";

  const purityValue = is916HM === true ? "916 HM" : purity || "";
  const buyingRateValue =
    is916HM === true
      ? buyingRate
      : purity
      ? (buyingRate * (parseFloat(purity) / 91.6)).toFixed(2)
      : buyingRate;

  const netAmount =
    parseFloat(buyingRateValue || 0) * parseFloat(netWeightFixed || 0);
  const commission = netAmount * (parseFloat(commissionPercent || 0) / 100);
  const miscAmount = parseFloat(misc || 0);
  const totalAmount = netAmount + commission + miscAmount;

  // Convert a file to base64 string
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) resolve(null);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // File handler
  const handleFileChange = (key, event) => {
    setFiles((prev) => ({
      ...prev,
      [key]: event.target.files[0] || null,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || customerName.trim().length < 3) {
      alert("Enter a valid customer name (min 3 chars)");
      return;
    }

    if (!/^(?:\+91)?[6-9]\d{9}$/.test(phone)) {
      alert("Enter a valid Indian phone number");
      return;
    }

    if (refMobile && !/^(?:\+91)?[6-9]\d{9}$/.test(refMobile)) {
      alert("Enter a valid reference mobile number or leave blank");
      return;
    }

    if (netWeightCalc <= 0) {
      alert("Net weight must be greater than zero");
      return;
    }

    try {
      // Convert files to base64 strings
      const filesBase64 = {};
      for (const [key, file] of Object.entries(files)) {
        filesBase64[key] = await fileToBase64(file);
      }
      const filesArray = Object.values(files || {}).filter(Boolean);
      console.log("branch:", branch);
      // Prepare JSON data
      const payload = {
        branchId: branch?._id,
        date: dayjs().toISOString(), // as ISO format, or keep as string if preferred
        goldDetails: {
          grossWeight: parseFloat(grossWeight),
          netWeight: parseFloat(netWeightFixed),
          purity: parseFloat(purity) || (is916HM ? 91.6 : 0),
        },
        buyingRate: parseFloat(buyingRateValue),
        commission: parseFloat(commission.toFixed(2)),
        deductions: parseFloat(misc || 0),
        netAmount: parseFloat(netAmount.toFixed(2)),
        totalPayable: parseFloat(totalAmount.toFixed(2)),
        // files: filesArray, // convert to array of base64 strings
      };

      console.log("Payload being sent:", payload);

      const res = await fetch(
        "http://localhost:5000/api/admin/sheet/buying-sheet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      alert("Buying sheet submitted successfully!");
      // Optionally reset form or navigate away
    } catch (err) {
      alert("Submission error: " + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading data...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow p-8 my-8">
      <h2 className="text-2xl font-bold mb-6 text-amber-700">Buying Sheet</h2>
      <form onSubmit={handleSubmit}>
        {/* Date and Branch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <div className="border rounded px-2 py-1 bg-gray-50">
              {dayjs().format("DD/MM/YYYY")}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Branch</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={branch?._id || ""} // safely get the current selected branch ID
              onChange={(e) => {
                const selectedBranch = branches.find(
                  (b) => b._id === e.target.value
                );
                setBranch(selectedBranch);
              }}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sheet Number */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Sheet Number</label>
          <div className="border rounded px-2 py-1 bg-gray-50">{sheetNo}</div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-1">Customer Name</label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              className="border rounded px-2 py-1 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Weights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-1">Gross Weight (g)</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              className="border rounded px-2 py-1 w-full"
              value={grossWeight}
              onChange={(e) => setGrossWeight(e.target.value)}
              placeholder="0.0000"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Stone Weight (g)</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              className="border rounded px-2 py-1 w-full"
              value={stoneWeight}
              onChange={(e) => setStoneWeight(e.target.value)}
              placeholder="0.0000"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Net Weight (g)</label>
            <div className="border rounded px-2 py-1 bg-gray-50">
              {netWeightFixed}
            </div>
          </div>
        </div>

        {/* Purity & 916 HM */}
        <div className="mb-6 flex items-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={is916HM === true}
              onChange={() => setIs916HM(is916HM === true ? null : true)}
            />
            <span>916 HM</span>
          </label>

          <div className="flex-1">
            <label className="block font-semibold mb-1">
              Purity (if not 916 HM)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="999"
              disabled={is916HM === true}
              className={`border rounded px-2 py-1 w-full ${
                is916HM === true ? "bg-gray-100" : ""
              }`}
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
              placeholder="e.g. 750, 875"
            />
          </div>
        </div>

        {/* Buying Rate Display */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Buying Rate</label>
          <div className="border rounded px-2 py-1 bg-gray-50">
            {buyingRateValue ? Number(buyingRateValue).toFixed(2) : "-"}
          </div>
        </div>

        {/* Mode of Payment */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Mode of Payment</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </select>
        </div>

        {/* Reference Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-1">Reference Name</label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              value={refName}
              onChange={(e) => setRefName(e.target.value)}
              placeholder="Reference name"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Reference Mobile</label>
            <input
              type="tel"
              className="border rounded px-2 py-1 w-full"
              value={refMobile}
              onChange={(e) => setRefMobile(e.target.value)}
              placeholder="Reference phone"
            />
          </div>
        </div>

        {/* Commission and Misc */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-1">Commission %</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="border rounded px-2 py-1 w-full"
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Commission Amount
            </label>
            <div className="border rounded px-2 py-1 bg-gray-50">
              {commission.toFixed(2)}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Miscellaneous</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="border rounded px-2 py-1 w-full"
              value={misc}
              onChange={(e) => setMisc(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Total Amount */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Total Amount</label>
          <div className="border rounded px-2 py-1 bg-gray-50">
            {totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Prepared By */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Prepared By</label>
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            placeholder="Your name"
          />
        </div>

        {/* File Uploads */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Article Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange("article", e)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Aadhaar Card</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange("adhar", e)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Bank Pledge Document
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange("bankPledge", e)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Declaration Document
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange("declaration", e)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
