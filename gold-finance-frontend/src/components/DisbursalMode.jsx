const DisbursalMode = ({
  disbursalMode,
  onlineAmount,
  offlineAmount,
  onChange,
}) => (
  <div className="mt-4">
    <label className="block font-semibold mb-2">Disbursal Mode:</label>
    <div className="flex gap-4">
      <label>
        <input
          type="radio"
          name="disbursalMode"
          value="online"
          checked={disbursalMode === "online"}
          onChange={onChange}
        />{" "}
        Online Only
      </label>
      <label>
        <input
          type="radio"
          name="disbursalMode"
          value="offline"
          checked={disbursalMode === "offline"}
          onChange={onChange}
        />{" "}
        Offline Only
      </label>
      <label>
        <input
          type="radio"
          name="disbursalMode"
          value="both"
          checked={disbursalMode === "both"}
          onChange={onChange}
        />{" "}
        Both
      </label>
    </div>

    {(disbursalMode === "online" || disbursalMode === "both") && (
      <input
        type="number"
        name="onlineAmount"
        placeholder="Online Amount"
        value={onlineAmount || ""}
        onChange={onChange}
        className="mt-2 w-full border p-2"
      />
    )}

    {(disbursalMode === "offline" || disbursalMode === "both") && (
      <input
        type="number"
        name="offlineAmount"
        placeholder="Offline Amount"
        value={offlineAmount || ""}
        onChange={onChange}
        className="mt-2 w-full border p-2"
      />
    )}
  </div>
);

export default DisbursalMode;
