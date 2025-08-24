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
    <div className="mt-4 space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Aadhaar Number</label>
        <input
          type="text"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        disabled={customerIdGenerated || loadingCustomerId}
        onClick={generateCustomerId}
        className="bg-purple-600 text-white w-full px-4 py-2 rounded"
      >
        {loadingCustomerId ? "Processing..." : "Generate CustomerId & Register"}
      </button>

      {customerIdGenerated && (
        <>
          <div className="font-bold text-center py-2 text-blue-700">
            Customer ID: {customerId}
          </div>
          <button
            className="bg-gray-800 text-white w-full px-4 py-2 rounded"
            onClick={() => setShowJewelleryTable(true)}
          >
            Add Jewellery Details
          </button>
        </>
      )}
    </div>
  );
}
