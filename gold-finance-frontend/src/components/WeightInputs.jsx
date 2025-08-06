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
    <div>
      {/* Gross & Stone Weight */}
      <input
        type="number"
        name="grossWeight"
        placeholder="Gross Weight"
        value={grossWeight}
        onChange={onWeightChange}
        className="w-full border p-2"
      />
      <input
        type="number"
        name="stoneWeight"
        placeholder="Stone Weight"
        value={stoneWeight}
        onChange={onWeightChange}
        className="w-full border p-2"
      />
      {grossWeight && stoneWeight && (
        <div className="mt-2 text-sm text-gray-700">
          Net Weight: {netWeight} g
        </div>
      )}

      {/* Is 916 HM */}
      <div className="flex gap-4 items-center mt-2">
        <label>Is 916 HM?</label>
        <label>
          <input
            type="radio"
            name="is916HM"
            value="true"
            checked={is916HM === true}
            onChange={() => on916HMChange(true)}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="is916HM"
            value="false"
            checked={is916HM === false}
            onChange={() => on916HMChange(false)}
          />
          No
        </label>
      </div>

      {/* Purity */}
      <input
        type="number"
        name="purity"
        placeholder="Purity"
        value={purity}
        onChange={onPurityChange}
        readOnly={is916HM === true}
        className="w-full border p-2 mt-2"
      />

      {/* Buying Rate */}
      <input
        type="number"
        name="buyingRate"
        placeholder="Buying Rate"
        value={buyingRate}
        readOnly
        className="w-full border p-2 mt-2"
      />

      {/* Net Amount */}
      {buyingRate && grossWeight && stoneWeight && (
        <div className="mt-2 text-sm text-gray-700">
          Net Amount: ₹ {netAmount.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default WeightInputs;
