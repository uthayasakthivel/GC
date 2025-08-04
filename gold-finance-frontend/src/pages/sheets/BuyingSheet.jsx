import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

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

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axiosInstance.get("/admin/config/rates/buying");
        const rate = formData.is916HM ? res.data.gold22k916 : res.data.gold22k;
        setFormData((prev) => ({
          ...prev,
          buyingRate: rate,
          purity: formData.is916HM ? 916 : "",
        }));
      } catch (err) {
        console.error("Rate fetch error", err);
      }
    };

    if (formData.is916HM !== null) {
      fetchRate();
    }
  }, [formData.is916HM]);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      alert("You can upload up to 4 images only.");
      return;
    }

    const newFiles = files.slice(0, 4 - images.length);
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
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
        {formData.grossWeight && formData.stoneWeight && (
          <div className="mt-2 text-sm text-gray-700">
            Net Weight:{" "}
            {parseFloat(formData.grossWeight || 0) -
              parseFloat(formData.stoneWeight || 0)}{" "}
            g
          </div>
        )}

        <div className="flex gap-4 items-center">
          <label>Is 916 HM?</label>
          <label>
            <input
              type="radio"
              name="is916HM"
              value="true"
              checked={formData.is916HM === true}
              onChange={() => handle916HMChange(true)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="is916HM"
              value="false"
              checked={formData.is916HM === false}
              onChange={() => handle916HMChange(false)}
            />
            No
          </label>
        </div>
        <input
          type="number"
          name="purity"
          placeholder="Purity"
          value={formData.purity}
          onChange={handleChange}
          readOnly={formData.is916HM === true}
          className="w-full border p-2"
        />

        <input
          type="number"
          name="buyingRate"
          placeholder="Buying Rate"
          value={formData.buyingRate}
          readOnly
          className="w-full border p-2"
        />

        {formData.buyingRate &&
          formData.grossWeight &&
          formData.stoneWeight && (
            <div className="mt-2 text-sm text-gray-700">
              Net Amount: ₹ {netAmount.toFixed(2)}
            </div>
          )}

        <div className="mt-4">
          <label className="block font-semibold mb-2">Disbursal Mode:</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="disbursalMode"
                value="online"
                checked={formData.disbursalMode === "online"}
                onChange={handleChange}
              />{" "}
              Online Only
            </label>
            <label>
              <input
                type="radio"
                name="disbursalMode"
                value="offline"
                checked={formData.disbursalMode === "offline"}
                onChange={handleChange}
              />{" "}
              Offline Only
            </label>
            <label>
              <input
                type="radio"
                name="disbursalMode"
                value="both"
                checked={formData.disbursalMode === "both"}
                onChange={handleChange}
              />{" "}
              Both
            </label>
          </div>

          {/* Input fields based on mode */}
          {(formData.disbursalMode === "online" ||
            formData.disbursalMode === "both") && (
            <input
              type="number"
              name="onlineAmount"
              placeholder="Online Amount"
              value={formData.onlineAmount || ""}
              onChange={handleChange}
              className="mt-2 w-full border p-2"
            />
          )}

          {(formData.disbursalMode === "offline" ||
            formData.disbursalMode === "both") && (
            <input
              type="number"
              name="offlineAmount"
              placeholder="Offline Amount"
              value={formData.offlineAmount || ""}
              onChange={handleChange}
              className="mt-2 w-full border p-2"
            />
          )}
        </div>

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
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Upload Images (Max 4):
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border p-2"
          />

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
