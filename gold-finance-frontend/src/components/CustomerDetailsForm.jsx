import { FingerPrintIcon, MapPinIcon } from "@heroicons/react/24/solid";

export default function CustomerDetailsForm({
  address,
  setAddress,
  aadharNumber,
  setAadharNumber,
  generateCustomerId,
  customerIdGenerated,
  loadingCustomerId,
  customerId,
  setShowJewelleryTable,
}) {
  return (
    <div className=" space-y-6">
      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block mt-6 mb-1 text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          placeholder="Enter Address"
        />
      </div>

      {/* Aadhaar Number */}
      <div>
        <label
          htmlFor="aadharNumber"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Aadhaar Number
        </label>
        <input
          type="text"
          id="aadharNumber"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value)}
          className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          placeholder="Enter Aadhaar Number"
        />
      </div>

      {/* Generate Customer ID Button */}
      <button
        disabled={customerIdGenerated || loadingCustomerId}
        onClick={generateCustomerId}
        className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
      >
        {loadingCustomerId ? "Processing..." : "Generate CustomerId & Register"}
      </button>

      {/* Customer ID Display & Add Jewellery */}
      {customerIdGenerated && (
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 font-semibold text-center">
            Customer ID: {customerId}
          </div>
          <button
            className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition"
            onClick={() => setShowJewelleryTable(true)}
          >
            Add Jewellery Details
          </button>
        </div>
      )}
    </div>
  );
}
