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
  const { images, previewUrls, handleImageChange, handleRemoveImage } =
    useImageUploader(4);

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

    // Append images
    images.forEach((img) => {
      payload.append("images", img);
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
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Buying Sheet</h2>
      <h2>Buying Sheet - {nextSheetNumber}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sample inputs */}
        <BranchSelect
          branches={branches}
          value={formData.branchId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={formData.customerName}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <ArticleSelect
          articles={articles}
          value={formData.articleId}
          onChange={handleChange}
        />
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

        <DisbursalMode
          amountDisbursedMethod={formData.amountDisbursedMethod}
          amountFromOnline={formData.amountFromOnline}
          amountFromOffline={formData.amountFromOffline}
          onChange={handleChange}
        />

        <CommissionInputs
          commissionPersonName={formData.commissionPersonName}
          commissionPhone={formData.commissionPhone}
          commissionFixed={formData.commissionFixed}
          onChange={handleChange}
        />
        <input
          type="number"
          name="miscellaneousAmount"
          placeholder="Miscellaneous Amount"
          value={formData.miscellaneousAmount}
          onChange={handleChange}
          className="w-full border p-2"
        />
        {netAmount > 0 && (
          <div className="mt-2 text-sm text-gray-800 font-semibold">
            Total Amount Spend: ₹ {totalAmountSpend.toFixed(2)}
          </div>
        )}

        <input
          type="text"
          name="preparedBy"
          placeholder="Prepared By"
          value={formData.preparedBy}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* Image Upload */}
        <ImageUploader
          previewUrls={previewUrls}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Sheet
        </button>
      </form>
    </div>
  );
};

export default BuyingSheet;
