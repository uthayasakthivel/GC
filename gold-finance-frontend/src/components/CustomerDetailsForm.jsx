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
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl space-y-6">
      {/* Address */}
      <div className="relative">
        <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Aadhaar Number */}
      <div className="relative">
        <FingerPrintIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value)}
          placeholder="Aadhaar Number"
          className="w-full pl-10 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
