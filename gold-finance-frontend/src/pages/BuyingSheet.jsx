import { useRef, useState } from "react";
import dayjs from "dayjs";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

const DUMMY_BRANCHES = ["Main Branch", "Anna Nagar", "T Nagar"];
const DUMMY_BUYING_RATE = 5800; // ₹/gm for 916 HM

function FileUpload({ label, accept, onChange }) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{label}</label>
      <input
        type="file"
        accept={accept}
        capture={accept === "image/*" ? "environment" : undefined}
        onChange={onChange}
        className="border rounded px-2 py-1 w-full"
      />
    </div>
  );
}

export default function BuyingSheet() {
  const [branches] = useState(DUMMY_BRANCHES);
  const [buyingRate] = useState(DUMMY_BUYING_RATE);
  const [branch, setBranch] = useState(branches[0]);
  const [sheetNo] = useState("GB-1");
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

  const netWeightCalc =
    parseFloat(grossWeight || 0) - parseFloat(stoneWeight || 0);
  const netWeightFixed =
    netWeightCalc > 0 ? netWeightCalc.toFixed(4) : "0.0000";
  const purityValue =
    is916HM === true ? "916 HM" : purity ? purity : "Enter purity";
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

  const isValidName = customerName.trim().length > 2;
  const isValidPhone = /^(\+91)?[6-9]\d{9}$/.test(phone);
  const isValidRefMobile = !refMobile || /^(\+91)?[6-9]\d{9}$/.test(refMobile);

  const handleFileChange = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };
  const handleOpenPreview = () => {
    const data = {
      date: dayjs().format("DD/MM/YYYY"),
      branch,
      sheetNo,
      customerName,
      phone,
      grossWeight,
      stoneWeight,
      netWeight: netWeightFixed,
      is916HM,
      purity,
      buyingRate: buyingRateValue,
      netAmount: netAmount.toFixed(2),
      mode,
      refName,
      refMobile,
      commissionPercent,
      commission: commission.toFixed(2),
      misc,
      totalAmount: totalAmount.toFixed(2),
      preparedBy,
    };

    localStorage.setItem("buyingSheetData", JSON.stringify(data));
    window.open("/preview.html", "_blank");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data object
    const data = {
      date: dayjs().format("DD/MM/YYYY"),
      branch,
      sheetNo,
      customerName,
      phone,
      grossWeight,
      stoneWeight,
      netWeight: netWeightFixed,
      is916HM,
      purity,
      buyingRate: buyingRateValue,
      netAmount: netAmount.toFixed(2),
      mode,
      refName,
      refMobile,
      commissionPercent,
      commission: commission.toFixed(2),
      misc,
      totalAmount: totalAmount.toFixed(2),
      preparedBy,
      files,
    };

    console.log("Buying Sheet Submitted Data:", data);

    alert("Submitted! (Check console for data)");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow p-8 my-8">
      <h2 className="text-2xl font-bold mb-6 text-amber-700">Buying Sheet</h2>
      <form onSubmit={handleSubmit}>
        {/* Date & Branch */}
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
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Sheet No */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Sheet Number</label>
          <div className="border rounded px-2 py-1 bg-gray-50">{sheetNo}</div>
        </div>
        {/* Customer Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-1">Customer Name</label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              minLength={3}
              placeholder="Enter customer name"
            />
            {!isValidName && customerName && (
              <span className="text-red-500 text-xs">Name too short</span>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              className="border rounded px-2 py-1 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="^(\+91)?[6-9]\d{9}$"
              placeholder="Enter phone number"
            />
            {!isValidPhone && phone && (
              <span className="text-red-500 text-xs">
                Invalid Indian mobile
              </span>
            )}
          </div>
        </div>
        {/* Weights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-1">
              Gross Weight (gm)
            </label>
            <input
              type="number"
              step="0.0001"
              className="border rounded px-2 py-1 w-full"
              value={grossWeight}
              onChange={(e) => setGrossWeight(e.target.value)}
              min="0"
              placeholder="0.0000"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Stone/Dirt Weight (gm)
            </label>
            <input
              type="number"
              step="0.0001"
              className="border rounded px-2 py-1 w-full"
              value={stoneWeight}
              onChange={(e) => setStoneWeight(e.target.value)}
              min="0"
              placeholder="0.0000"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Net Weight (gm)</label>
            <div className="border rounded px-2 py-1 bg-gray-50">
              {netWeightFixed}
            </div>
          </div>
        </div>
        {/* Purity */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">916 HM?</label>
          <div className="flex gap-4 mb-2">
            <button
              type="button"
              className={`px-4 py-1 rounded border ${
                is916HM === true
                  ? "bg-amber-200 border-amber-700"
                  : "bg-gray-100 border-gray-300"
              }`}
              onClick={() => {
                setIs916HM(true);
                setPurity("");
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-4 py-1 rounded border ${
                is916HM === false
                  ? "bg-amber-200 border-amber-700"
                  : "bg-gray-100 border-gray-300"
              }`}
              onClick={() => setIs916HM(false)}
            >
              No
            </button>
          </div>
          {is916HM === false && (
            <input
              type="number"
              step="0.01"
              className="border rounded px-2 py-1 w-40"
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
              min="0"
              max="100"
              placeholder="Enter purity %"
            />
          )}
          {is916HM === true && (
            <div className="text-green-700 font-semibold">916 HM</div>
          )}
        </div>
        {/* Buying Rate & Net Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-1">
              Buying Rate (₹/gm)
            </label>
            <div className="border rounded px-2 py-1 bg-gray-50">
              {buyingRateValue}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Net Amount (₹)</label>
            <div className="border rounded px-2 py-1 bg-gray-50">
              {netAmount.toFixed(2)}
            </div>
          </div>
        </div>
        {/* Mode of Payment */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Mode of Payment</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="mode"
                value="offline"
                checked={mode === "offline"}
                onChange={() => setMode("offline")}
              />{" "}
              Offline
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="online"
                checked={mode === "online"}
                onChange={() => setMode("online")}
              />{" "}
              Online
            </label>
          </div>
        </div>
        {/* Commission */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Commission</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              className="border rounded px-2 py-1"
              value={refName}
              onChange={(e) => setRefName(e.target.value)}
              placeholder="Reference Name"
            />
            <input
              type="tel"
              className="border rounded px-2 py-1"
              value={refMobile}
              onChange={(e) => setRefMobile(e.target.value)}
              placeholder="Reference Mobile"
            />
            <input
              type="number"
              step="0.01"
              className="border rounded px-2 py-1"
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
              min="0"
              max="100"
              placeholder="% Commission"
            />
          </div>
          {!isValidRefMobile && refMobile && (
            <span className="text-red-500 text-xs">Invalid mobile</span>
          )}
        </div>
        {/* Misc */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Miscellaneous (₹)</label>
          <input
            type="number"
            step="0.01"
            className="border rounded px-2 py-1 w-40"
            value={misc}
            onChange={(e) => setMisc(e.target.value)}
            min="0"
            placeholder="0.00"
          />
        </div>
        {/* Total Amount */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Total Amount (₹)</label>
          <div className="border rounded px-2 py-1 bg-gray-50 font-bold text-lg">
            {totalAmount.toFixed(2)}
          </div>
        </div>
        {/* File Uploads */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Files Upload</label>
          <FileUpload
            label="Article Picture with Weight"
            accept="image/*"
            onChange={(e) => handleFileChange("article", e.target.files[0])}
          />
          <FileUpload
            label="Aadhar"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange("adhar", e.target.files[0])}
          />
          <FileUpload
            label="Bank Pledge Sheet"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange("bankPledge", e.target.files[0])}
          />
          <FileUpload
            label="Self Declaration"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange("declaration", e.target.files[0])}
          />
        </div>
        {/* Sheet Prepared By */}
        <div className="mb-8 flex justify-end">
          <div>
            <label className="block font-semibold mb-1">
              Sheet Prepared By
            </label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-40"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              placeholder="Name"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="submit"
            className="bg-amber-700 text-white px-6 py-2 rounded shadow hover:bg-amber-800 transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleOpenPreview}
            style={{ marginRight: "1rem" }}
          >
            Preview
          </button>
        </div>
      </form>
    </div>
  );
}
