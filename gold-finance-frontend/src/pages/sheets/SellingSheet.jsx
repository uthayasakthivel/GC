import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNextSheetNumber } from "../../hooks/useNextSheetNumber";
import { useBuyingSheets } from "../../hooks/useBuyingSheets";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

import DisbursalMode from "../../components/DisbursalMode";

import {
  DocumentTextIcon,
  CurrencyRupeeIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  PencilSquareIcon,
  ScaleIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

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
      await axiosInstance.post("/sheet/selling-sheet", payload);
      alert("Selling Sheet created successfully!");

      await Promise.all([refetch(), refetchBuyingSheets()]);

      const role = user?.role;
      if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/manager");
      else navigate("/employee");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("❌ Error creating selling sheet");
    }
  };

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
        setArticleName(res.data.name);
      } catch (err) {
        console.error("❌ Error fetching article", err);
        setArticleName("");
      }
    };

    fetchArticleName();
  }, [articleId]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4 flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-semibold text-gray-800 gap-2">
          <DocumentTextIcon className="w-6 h-6 text-green-600" />
          Create Selling Sheet
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

        {/* Selling Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <CurrencyRupeeIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="sellingRate"
              placeholder="Selling Rate (₹)"
              value={formData.sellingRate}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <ArrowTrendingUpIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="valueAdded"
              placeholder="Value Added (₹)"
              value={formData.valueAdded}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <BanknotesIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="netAmount"
              placeholder="Net Amount (₹)"
              value={formData.netAmount}
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

        {/* Buyer Details */}
        <div className="space-y-3">
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="buyerName"
              placeholder="Buyer Name"
              value={formData.buyerName}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <PencilSquareIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="preparedBy"
              placeholder="Prepared By"
              value={formData.preparedBy}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Summary */}
        {selectedBuyingSheet && (
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm text-gray-700 text-base space-y-3 divide-y divide-gray-100">
            <p className="flex justify-between items-center py-1">
              <span className="flex items-center gap-2 font-medium">
                <ScaleIcon className="w-5 h-5 text-gray-500" />
                Gross Weight:
              </span>
              <span>{grossWeight} g</span>
            </p>
            <p className="flex justify-between items-center py-1">
              <span className="flex items-center gap-2 font-medium">
                <ShoppingBagIcon className="w-5 h-5 text-gray-500" />
                Article:
              </span>
              <span>
                {selectedBuyingSheet?.articleId?.jewelleryName || "Loading..."}
              </span>
            </p>
            <p className="flex justify-between items-center py-1">
              <span className="flex items-center gap-2 font-medium">
                <BanknotesIcon className="w-5 h-5 text-green-500" />
                Buying Amount:
              </span>
              <span className="text-green-600 font-semibold">
                ₹{buyingAmount.toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between items-center py-1">
              <span className="flex items-center gap-2 font-medium">
                <CurrencyRupeeIcon className="w-5 h-5 text-blue-500" />
                Gross Amount:
              </span>
              <span className="text-blue-600 font-semibold">
                ₹{grossAmount.toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between items-center py-1">
              <span className="flex items-center gap-2 font-medium">
                <ArrowTrendingUpIcon className="w-5 h-5 text-purple-500" />
                Net Profit:
              </span>
              <span className="text-purple-600 font-semibold">
                ₹{netProfit.toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between items-center py-1">
              <span className="flex items-center gap-2 font-medium">
                <BanknotesIcon className="w-5 h-5 text-gray-500" />
                Total Received:
              </span>
              <span className="text-gray-900 font-semibold">
                ₹{totalPaid.toFixed(2)}
              </span>
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <CheckCircleIcon className="w-5 h-5" />
          Submit Selling Sheet
        </button>
      </form>
    </div>
  );
};

export default SellingSheet;
