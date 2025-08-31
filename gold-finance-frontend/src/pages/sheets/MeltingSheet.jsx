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
import {
  FireIcon,
  ShoppingBagIcon,
  ScaleIcon,
  BanknotesIcon,
  AdjustmentsVerticalIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  UserIcon,
  PencilSquareIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

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
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4 flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-semibold text-gray-800 gap-2">
          <FireIcon className="w-6 h-6 text-green-600" />
          Create Melting Sheet
        </h2>
        <span className="text-gray-500 text-sm">
          Sheet No: {nextSheetNumber}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Buying Sheet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Buying Sheet
          </label>
          <div className="relative">
            <ShoppingBagIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <select
              name="buyingSheetId"
              value={formData.buyingSheetId}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            >
              <option value="">Choose a sheet</option>
              {buyingSheets.map((sheet) => (
                <option key={sheet._id} value={sheet._id}>
                  {sheet.sheetNumber} - {sheet.customerName} -{" "}
                  {sheet.articleName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Read-only Info */}
        <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm text-gray-700 text-base space-y-3 divide-y divide-gray-100">
          <p className="flex justify-between items-center py-1">
            <span className="flex items-center gap-2 font-medium">
              <DocumentTextIcon className="w-5 h-5 text-gray-500" />
              Buying Sheet Number:
            </span>
            <span>{formData.buyingSheetNumber || "-"}</span>
          </p>
          <p className="flex justify-between items-center py-1">
            <span className="flex items-center gap-2 font-medium">
              <ScaleIcon className="w-5 h-5 text-gray-500" />
              Gross Weight:
            </span>
            <span>{formData.grossWeight || "-"} g</span>
          </p>
          <p className="flex justify-between items-center py-1">
            <span className="flex items-center gap-2 font-medium">
              <BanknotesIcon className="w-5 h-5 text-green-500" />
              Buying Amount:
            </span>
            <span className="text-green-600 font-semibold">
              ₹{formData.buyingAmount || "-"}
            </span>
          </p>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <ScaleIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="number"
              step="0.001"
              name="afterStone"
              placeholder="After Stone (g)"
              value={formData.afterStone}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <FireIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="number"
              step="0.001"
              name="afterMelting"
              placeholder="After Melting (g)"
              value={formData.afterMelting}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <AdjustmentsVerticalIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="kacchaPurity"
              placeholder="Kaccha Purity"
              value={formData.kacchaPurity}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <BanknotesIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="number"
              step="0.01"
              name="totalAmountRecieved"
              placeholder="Total Amount Received"
              value={formData.totalAmountRecieved}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Disbursal Mode */}
        <DisbursalMode
          amountDisbursedMethod={formData.amountDisbursedMethod}
          amountFromOnline={formData.amountFromOnline}
          amountFromOffline={formData.amountFromOffline}
          onChange={handleChange}
        />

        {/* Melting Center / Place / Ref */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <BuildingLibraryIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="meltingCenter"
              placeholder="Melting Center"
              value={formData.meltingCenter}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="meltingPlace"
              placeholder="Melting Place"
              value={formData.meltingPlace}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="meltingRefPerson"
              placeholder="Melting Reference Person"
              value={formData.meltingRefPerson}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="relative">
            <CurrencyRupeeIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="number"
              step="0.01"
              name="sellingRate"
              placeholder="Selling Amount"
              value={formData.sellingRate}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Prepared By */}
        <div className="relative">
          <PencilSquareIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="preparedBy"
            placeholder="Sheet Prepared By"
            value={formData.preparedBy}
            onChange={handleChange}
            className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Image Uploader */}
        <ImageUploader
          sheetType="melting"
          previewUrls={previewUrls}
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
        />

        {/* Net Profit */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 font-semibold text-lg text-center">
          Net Profit: ₹ {netProfit.toFixed(2)}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <CheckCircleIcon className="w-5 h-5" />
          Submit Melting Sheet
        </button>
      </form>
    </div>
  );
};

export default MeltingSheet;
