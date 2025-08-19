import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useBuyingSheets } from "../../hooks/useBuyingSheets"; // for buying sheets list
import { useNextSheetNumber } from "../../hooks/useNextSheetNumber";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import DisbursalMode from "../../components/DisbursalMode";
import ImageUploader from "../../components/ImageUploader";
import { useImageUploader } from "../../hooks/useImageUploader";

const MeltingSheet = () => {
  const [formData, setFormData] = useState({
    buyingSheetId: "",
    sheetNumber: "",
    afterStone: "", // uppercase S
    afterMelting: "", // uppercase M
    kacchaPurity: "",
    totalAmountRecieved: "",
    amountDisbursedMethod: "",
    amountFromOnline: "",
    amountFromOffline: "",
    meltingCenter: "",
    meltingPlace: "",
    meltingRefPerson: "",
    sellingRate: "",
    preparedBy: "", // rename from sheetPreparedBy
    // ...
  });

  const [selectedBuyingSheet, setSelectedBuyingSheet] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { refetch } = useDashboardData();
  const { buyingSheets, refetch: refetchBuyingSheets } = useBuyingSheets();
  const { nextSheetNumber } = useNextSheetNumber("MeltingSheet");
  const { files, previewUrls, handleFileChange, handleRemoveFile } =
    useImageUploader(2);
  // Fetch data from selected buying sheet
  useEffect(() => {
    if (!formData.buyingSheetId) return;

    const fetchBuyingSheet = async () => {
      try {
        const res = await axiosInstance.get(
          `/sheet/buying-sheet/${formData.buyingSheetId}` // use buyingSheetId here!
        );
        const sheet = res.data;
        setSelectedBuyingSheet(sheet);

        // Update form with API data
        setFormData((prev) => ({
          ...prev,
          buyingSheetNumber: sheet.sheetNumber || "", // for display only
          grossWeight: sheet.goldDetails?.grossWeight || "",
          buyingAmount: sheet.netAmount || "",
        }));
      } catch (error) {
        console.error("Error fetching buying sheet", error);
        setSelectedBuyingSheet(null);
      }
    };

    fetchBuyingSheet();
  }, [formData.buyingSheetId]); // watch buyingSheetId

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate netProfit = sellingRate - totalAmountRecieved
  const netProfit =
    parseFloat(formData.sellingRate || 0) -
    parseFloat(formData.buyingAmount || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    console.log(payload, "data send from buying sheet creation");
    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    files.filter(Boolean).forEach((file) => {
      payload.append("images", file);
    });

    console.log(payload, "payloadsss");

    for (const [key, value] of payload.entries()) {
      if (value instanceof File) {
        console.log(key, value.name, "qqqq");
      } else {
        console.log(key, value);
      }
    }

    try {
      // 1️⃣ Create Melting Sheet
      await axiosInstance.post("/sheet/melting-sheet", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Melting Sheet created successfully!");

      // 3️⃣ Refresh dashboard and buying sheet dropdown
      await Promise.all([refetch(), refetchBuyingSheets()]);

      // 4️⃣ Redirect based on role
      const role = user?.role;
      if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/manager");
      else navigate("/employee");
    } catch (error) {
      console.error("Error submitting melting sheet", error);
      alert("Error creating melting sheet");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Melting Sheet</h2>
      <h3 className="mb-2">Melting Sheet Number: {nextSheetNumber}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="buyingSheetId" // <-- Changed to buyingSheetId
          value={formData.buyingSheetId} // <-- use buyingSheetId as value (ID)
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
        {/* Show API data readonly */}
        <div className="bg-gray-100 p-3 rounded text-sm space-y-1">
          <p>
            <strong>Buying Sheet Number:</strong>{" "}
            {formData.buyingSheetNumber || "-"}
          </p>
          <p>
            <strong>Gross Weight:</strong> {formData.grossWeight || "-"} g
          </p>
          <p>
            <strong>Buying Amount:</strong> ₹{formData.buyingAmount || "-"}
          </p>
        </div>
        {/* UI Inputs */}
        <input
          type="number"
          step="0.001"
          name="afterStone"
          placeholder="After Stone (g)"
          value={formData.afterStone}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="number"
          step="0.001"
          name="afterMelting"
          placeholder="After Melting (g)"
          value={formData.afterMelting}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          name="kacchaPurity"
          placeholder="Kaccha Purity"
          value={formData.kacchaPurity}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="number"
          step="0.01"
          name="totalAmountRecieved"
          placeholder="Total Amount Received"
          value={formData.totalAmountRecieved}
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
          name="meltingCenter"
          placeholder="Melting Center"
          value={formData.meltingCenter}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          name="meltingPlace"
          placeholder="Melting Place"
          value={formData.meltingPlace}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          name="meltingRefPerson"
          placeholder="Melting Reference Person"
          value={formData.meltingRefPerson}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          step="0.01"
          name="sellingRate"
          placeholder="Selling Amount"
          value={formData.sellingRate}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          name="preparedBy"
          placeholder="Sheet Prepared By"
          value={formData.preparedBy}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <ImageUploader
          sheetType="melting" // or "buyingSheet"
          previewUrls={previewUrls}
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
        />
        {/* Net Profit Display */}
        <div className="mt-2 p-2 bg-green-100 rounded font-semibold">
          Net Profit: ₹ {netProfit.toFixed(2)}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Melting Sheet
        </button>
      </form>
    </div>
  );
};

export default MeltingSheet;
