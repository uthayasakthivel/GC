const WeightInputs = ({
  grossWeight,
  stoneWeight,
  is916HM,
  purity,
  buyingRate,
  netAmount,
  onWeightChange,
  on916HMChange,
  onPurityChange,
}) => {
  const netWeight = parseFloat(grossWeight || 0) - parseFloat(stoneWeight || 0);

  return (
    <div className="space-y-4">
      {/* Gross & Stone Weight */}
      <input
        type="number"
        name="grossWeight"
        placeholder="Gross Weight (g)"
        value={grossWeight}
        onChange={onWeightChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
      />
      <input
        type="number"
        name="stoneWeight"
        placeholder="Stone Weight (g)"
        value={stoneWeight}
        onChange={onWeightChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
      />
      {grossWeight && stoneWeight && (
        <div className="mt-2 text-sm text-gray-700 font-semibold">
          Net Weight: {netWeight} g
        </div>
      )}

      {/* Is 916 HM */}
      <div className="mt-4">
        <p className="text-gray-700 mb-2 font-medium">Is 916 HM?</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="is916HM"
              value="true"
              checked={is916HM === true}
              onChange={() => on916HMChange(true)}
              className="accent-[#00b8db] w-4 h-4"
            />
            <span className="text-gray-700">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="is916HM"
              value="false"
              checked={is916HM === false}
              onChange={() => on916HMChange(false)}
              className="accent-[#00b8db] w-4 h-4"
            />
            <span className="text-gray-700">No</span>
          </label>
        </div>
      </div>

      {/* Purity */}
      <input
        type="number"
        name="purity"
        placeholder="Purity (%)"
        value={purity}
        onChange={onPurityChange}
        readOnly={is916HM === true}
        className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none ${
          is916HM === true ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />

      {/* Buying Rate */}
      <input
        type="number"
        name="buyingRate"
        placeholder="Buying Rate (₹)"
        value={buyingRate}
        readOnly
        className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
      />

      {/* Net Amount */}
      {buyingRate && grossWeight && stoneWeight && (
        <div className="mt-2 text-sm text-gray-700 font-semibold">
          Net Amount: ₹ {netAmount.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default WeightInputs;
