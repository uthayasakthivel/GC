import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const BuyingSheet = () => {
  const [formData, setFormData] = useState({
    branchId: "",
    sheetNumber: "",
    customerName: "",
    phoneNumber: "",
    grossWeight: "",
    stoneWeight: "",
    is916HM: false,
    purity: "",
    buyingRate: "",
    amountDisbursed: "",
    commissionPersonName: "",
    commissionPhone: "",
    commissionFixed: "",
    miscellaneousAmount: "",
    preparedBy: "",
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [branches, setBranches] = useState([]);
  const [nextSheetNumber, setNextSheetNumber] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      const res = await axiosInstance.get("/admin/config/branches");
      setBranches(res.data);
    };

    const fetchNextSheetNumber = async () => {
      const res = await axiosInstance.get("/sheet/buying-sheet/next-number");
      setNextSheetNumber(res.data.next);
    };

    fetchBranches();
    fetchNextSheetNumber();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);

    // Generate preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    // Append images
    images.forEach((img) => {
      payload.append("images", img);
    });

    try {
      const res = await axiosInstance.post("/sheet/buying-sheet", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Success:", res.data);
      alert("Sheet created successfully!");
    } catch (error) {
      console.error("Error creating sheet:", error);
      alert("Error occurred. Check console.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Buying Sheet</h2>
      <h2>Buying Sheet - {nextSheetNumber}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sample inputs */}
        <select
          name="branchId"
          value={formData.branchId}
          onChange={handleChange}
          required
        >
          <option value="">Select Branch</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.name}
            </option>
          ))}
        </select>
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
        <input
          type="number"
          name="grossWeight"
          placeholder="Gross Weight"
          value={formData.grossWeight}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="stoneWeight"
          placeholder="Stone Weight"
          value={formData.stoneWeight}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <label className="block">
          <input
            type="checkbox"
            name="is916HM"
            checked={formData.is916HM}
            onChange={handleChange}
          />
          <span className="ml-2">916 HM</span>
        </label>
        <input
          type="number"
          name="purity"
          placeholder="Purity"
          value={formData.purity}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="buyingRate"
          placeholder="Buying Rate"
          value={formData.buyingRate}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="text"
          name="amountDisbursed"
          placeholder="Amount Disbursed"
          value={formData.amountDisbursed}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="text"
          name="commissionPersonName"
          placeholder="Commission Person Name"
          value={formData.commissionPersonName}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="tel"
          name="commissionPhone"
          placeholder="Commission Phone"
          value={formData.commissionPhone}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="commissionFixed"
          placeholder="Commission Fixed"
          value={formData.commissionFixed}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="miscellaneousAmount"
          placeholder="Miscellaneous Amount"
          value={formData.miscellaneousAmount}
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

        {/* File input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full border p-2"
        />
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index}`}
                className="w-full h-40 object-cover border"
              />
            ))}
          </div>
        )}

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
