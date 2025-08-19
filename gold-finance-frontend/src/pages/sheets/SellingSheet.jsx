import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNextSheetNumber } from "../../hooks/useNextSheetNumber";
import { useBuyingSheets } from "../../hooks/useBuyingSheets";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

import DisbursalMode from "../../components/DisbursalMode";

const SellingSheet = () => {
  const [formData, setFormData] = useState({
    buyingSheetId: "",
    sellingRate: "",
    valueAdded: "",
    netAmount: "",
    amountDisbursedMethod: "",
    amountFromOnline: "",
    amountFromOffline: "",
    buyerName: "",
    phoneNumber: "",
    address: "",
    preparedBy: "",
  });

  const [selectedBuyingSheet, setSelectedBuyingSheet] = useState(null);

  const [articleName, setArticleName] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const { refetch } = useDashboardData();
  const { buyingSheets, refetch: refetchBuyingSheets } = useBuyingSheets();
  const { nextSheetNumber } = useNextSheetNumber("SellingSheet");

  useEffect(() => {
    const fetchSelectedSheet = async () => {
      if (!formData.buyingSheetId) return;

      try {
        const res = await axiosInstance.get(
          `/sheet/buying-sheet/${formData.buyingSheetId}`
        );
        console.log(res.data, "✅ Full buying sheet details");
        setSelectedBuyingSheet(res.data);
      } catch (err) {
        console.error("❌ Error fetching selected sheet", err);
        setSelectedBuyingSheet(null);
      }
    };

    fetchSelectedSheet();
  }, [formData.buyingSheetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      preparedBy: formData.preparedBy || user?.name || "",
    };

    try {
      // 1️⃣ Create Selling Sheet
      await axiosInstance.post("/sheet/selling-sheet", payload);
      alert("Selling Sheet created successfully!");

      // // 2️⃣ Delete the selected Buying Sheet
      // if (formData.buyingSheetId) {
      //   await axiosInstance.delete(
      //     `/sheet/buying-sheet/${formData.buyingSheetId}`
      //   );
      //   console.log(`Buying sheet ${formData.buyingSheetId} deleted ✅`);
      // }

      // 3️⃣ Refresh dashboard and buying sheet dropdown
      await Promise.all([refetch(), refetchBuyingSheets()]);

      // 4️⃣ Redirect based on role
      const role = user?.role;
      if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/manager");
      else navigate("/employee");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("❌ Error creating selling sheet");
    }
  };

  // --- Calculations ---
  const grossWeight = parseFloat(
    selectedBuyingSheet?.goldDetails?.grossWeight || 0
  );
  const articleId = selectedBuyingSheet?.articleId || "";
  const sellingRate = parseFloat(formData.sellingRate || 0);
  const valueAdded = parseFloat(formData.valueAdded || 0);
  const buyingAmount = parseFloat(selectedBuyingSheet?.netAmount || 0);

  const grossAmount = grossWeight * sellingRate + valueAdded;
  const netProfit = grossAmount - buyingAmount;
  const totalPaid =
    parseFloat(formData.amountFromOnline || 0) +
    parseFloat(formData.amountFromOffline || 0);

  useEffect(() => {
    const fetchArticleName = async () => {
      if (!articleId) return;

      try {
        const res = await axiosInstance.get(
          `/admin/config/jewellery/${articleId?._id}`
        );
        setArticleName(res.data.name); // or res.data.articleName depending on schema
      } catch (err) {
        console.error("❌ Error fetching article", err);
        setArticleName("");
      }
    };

    fetchArticleName();
  }, [articleId]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Selling Sheet</h2>
      <h3 className="text-gray-600 mb-2">Sheet Number: {nextSheetNumber}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Buying Sheet Select */}
        <select
          name="buyingSheetId"
          value={formData.buyingSheetId}
          onChange={handleChange}
          className="w-full border p-2"
          required
        >
          <option value="">Select Buying Sheet</option>
          {buyingSheets.map((sheet) => (
            <option key={sheet._id} value={sheet._id}>
              {sheet.sheetNumber} - {sheet.customerName} - {sheet.articleName}
            </option>
          ))}
        </select>

        {/* Selling Rate and Value Added */}
        <input
          type="number"
          name="sellingRate"
          placeholder="Selling Rate (₹)"
          value={formData.sellingRate}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <input
          type="number"
          name="valueAdded"
          placeholder="Value Added (₹)"
          value={formData.valueAdded}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="number"
          name="netAmount"
          placeholder="Net Amount (₹)"
          value={formData.netAmount}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <DisbursalMode
          amountDisbursedMethod={formData.amountDisbursedMethod}
          amountFromOnline={formData.amountFromOnline}
          amountFromOffline={formData.amountFromOffline}
          onChange={handleChange}
        />

        <input
          type="text"
          name="buyerName"
          placeholder="Buyer Name"
          value={formData.buyerName}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          type="text"
          name="preparedBy"
          placeholder="Prepared By"
          value={formData.preparedBy}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* Summary */}
        {selectedBuyingSheet && (
          <div className="bg-gray-100 p-3 rounded text-sm">
            <p>
              <strong>Gross Weight:</strong> {grossWeight}g
            </p>
            <p>
              <strong>Article:</strong>{" "}
              {selectedBuyingSheet?.articleId?.jewelleryName || "Loading..."}
            </p>

            <p>
              <strong>Buying Amount:</strong> ₹{buyingAmount.toFixed(2)}
            </p>
            <p>
              <strong>Gross Amount:</strong> ₹{grossAmount.toFixed(2)}
            </p>

            <p>
              <strong>Net Profit:</strong> ₹{netProfit.toFixed(2)}
            </p>
            <p>
              <strong>Total Received:</strong> ₹{totalPaid.toFixed(2)}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Selling Sheet
        </button>
      </form>
    </div>
  );
};

export default SellingSheet;
