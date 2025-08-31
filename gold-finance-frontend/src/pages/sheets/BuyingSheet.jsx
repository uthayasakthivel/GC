import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useBranches } from "../../hooks/useBranches";
import { useArticles } from "../../hooks/useArticles";
import { useNextSheetNumber } from "../../hooks/useNextSheetNumber";
import { useBuyingRate } from "../../hooks/useBuyingRate";
import { useImageUploader } from "../../hooks/useImageUploader";

import BranchSelect from "../../components/BranchSelect";
import ArticleSelect from "../../components/ArticleSelect";
import WeightInputs from "../../components/WeightInputs";
import DisbursalMode from "../../components/DisbursalMode"; // Assuming this component handles disbursal mode selection
import ImageUploader from "../../components/ImageUploader"; // Assuming this component handles image uploads
import CommissionInputs from "../../components/CommissionInputs";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const BuyingSheet = () => {
  const [formData, setFormData] = useState({
    branchId: "",
    sheetNumber: "",
    customerName: "",
    phoneNumber: "",
    articleId: "",
    grossWeight: "",
    stoneWeight: "",
    is916HM: false,
    purity: "",
    buyingRate: "",
    amountDisbursedMethod: "",
    amountFromOnline: "",
    amountFromOffline: "",
    commissionPersonName: "",
    commissionPhone: "",
    commissionFixed: "",
    miscellaneousAmount: "",
    preparedBy: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const { refetch } = useDashboardData();

  // ✅ Replace old API calls with hooks
  const { branches } = useBranches();
  const { articles } = useArticles();
  const { nextSheetNumber } = useNextSheetNumber("BuyingSheet");
  const { rate: buyingRate, purity } = useBuyingRate(formData.is916HM);
  const { files, previewUrls, handleFileChange, handleRemoveFile } =
    useImageUploader(4); // 4 for buyingSheet

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      buyingRate,
      purity,
    }));
  }, [buyingRate, purity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handle916HMChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      is916HM: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    console.log(payload, "data send from buying sheet creation");
    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    // Append files
    files.forEach((file) => {
      payload.append("images", file);
    });

    try {
      // Step 1: Submit the sheet
      const res = await axiosInstance.post("/sheet/buying-sheet", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Sheet submitted:", res.data);
      alert("Sheet created successfully!");

      // ✅ Refresh balances instantly
      await refetch();

      // Step 2: Reset commission fields
      setFormData((prev) => ({
        ...prev,
        commissionPersonName: "",
        commissionPhone: "",
        commissionFixed: "",
      }));

      const userRole = user?.role;

      // Step 4: Navigate to respective dashboard
      if (userRole === "manager") {
        navigate("/manager");
      } else if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "employee") {
        navigate("/employee");
      } else {
        navigate("/default");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error occurred. Check console for more details.");
    }
  };

  // Calculate net weight
  const netWeight =
    parseFloat(formData.grossWeight || 0) -
    parseFloat(formData.stoneWeight || 0);

  // Calculate net amount
  const netAmount = parseFloat(formData.buyingRate || 0) * netWeight;

  // Calculate total amount spend
  const totalAmountSpend =
    netAmount +
    parseFloat(formData.commissionFixed || 0) +
    parseFloat(formData.miscellaneousAmount || 0);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute -top-[-12] -left-24 bg-white rounded-full shadow-md p-3 hover:bg-gray-100 transition-all"
        title="Go Back"
      >
        <ArrowLeftIcon className="w-6 h-6 text-[#313485]" />
      </button>

      {/* Header */}
      <div className="mb-6 border-b border-gray-300 pb-4 flex items-center justify-between gap-3">
        <h2 className="text-3xl font-bold text-[#313485]">
          Create Buying Sheet
        </h2>
        <p className="text-gray-700 mt-1 text-base">
          Buying Sheet Number:{" "}
          <span className="inline-block bg-gray-100 text-[#00b8db] font-semibold px-2 py-1 rounded-md">
            {nextSheetNumber}
          </span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Branch Select */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            🏢 Branch Selection
          </h3>
          <BranchSelect
            branches={branches}
            value={formData.branchId}
            onChange={handleChange}
          />
        </div>

        {/* Customer Details */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            👤 Customer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
            />
          </div>
        </div>

        {/* Article Select */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            📦 Article
          </h3>
          <ArticleSelect
            articles={articles}
            value={formData.articleId}
            onChange={handleChange}
          />
        </div>

        {/* Weight Inputs */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            ⚖️ Weight Details
          </h3>
          <WeightInputs
            grossWeight={formData.grossWeight}
            stoneWeight={formData.stoneWeight}
            is916HM={formData.is916HM}
            purity={formData.purity}
            buyingRate={formData.buyingRate}
            netAmount={netAmount}
            onWeightChange={handleChange}
            on916HMChange={handle916HMChange}
            onPurityChange={handleChange}
          />
        </div>

        {/* Disbursal Mode */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            💳 Disbursal Mode
          </h3>
          <DisbursalMode
            amountDisbursedMethod={formData.amountDisbursedMethod}
            amountFromOnline={formData.amountFromOnline}
            amountFromOffline={formData.amountFromOffline}
            onChange={handleChange}
          />
        </div>

        {/* Commission Details */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            🤝 Commission Details
          </h3>
          <CommissionInputs
            commissionPersonName={formData.commissionPersonName}
            commissionPhone={formData.commissionPhone}
            commissionFixed={formData.commissionFixed}
            onChange={handleChange}
          />
        </div>

        {/* Miscellaneous */}
        <input
          type="number"
          name="miscellaneousAmount"
          placeholder="Miscellaneous Amount"
          value={formData.miscellaneousAmount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
        />

        {/* Total Amount */}
        {netAmount > 0 && (
          <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 font-semibold text-lg shadow-sm">
            💰 Total Amount Spend: ₹ {totalAmountSpend.toFixed(2)}
          </div>
        )}

        {/* Prepared By */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            🖊️ Prepared By
          </h3>
          <input
            type="text"
            name="preparedBy"
            placeholder="Prepared By"
            value={formData.preparedBy}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
          />
        </div>

        {/* Image Upload */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            📷 Upload Images
          </h3>
          <ImageUploader
            sheetType="buyingSheet"
            files={files}
            previewUrls={previewUrls}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#00b8db] to-[#313485] text-white text-xl font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
        >
          ✅ Submit Sheet
        </button>
      </form>
    </div>
  );
};

export default BuyingSheet;
