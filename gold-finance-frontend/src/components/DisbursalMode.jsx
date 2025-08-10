const DisbursalMode = ({
  amountDisbursedMethod,
  amountFromOnline,
  amountFromOffline,
  onChange,
}) => (
  <div className="mt-4">
    <label className="block font-semibold mb-2">Disbursal Mode:</label>
    <div className="flex gap-4">
      <label>
        <input
          type="radio"
          name="amountDisbursedMethod"
          value="online"
          checked={amountDisbursedMethod === "online"}
          onChange={onChange}
        />{" "}
        Online Only
      </label>
      <label>
        <input
          type="radio"
          name="amountDisbursedMethod"
          value="offline"
          checked={amountDisbursedMethod === "offline"}
          onChange={onChange}
        />{" "}
        Offline Only
      </label>
      <label>
        <input
          type="radio"
          name="amountDisbursedMethod"
          value="both"
          checked={amountDisbursedMethod === "both"}
          onChange={onChange}
        />{" "}
        Both
      </label>
    </div>

    {(amountDisbursedMethod === "online" ||
      amountDisbursedMethod === "both") && (
      <input
        type="number"
        name="amountFromOnline"
        placeholder="Online Amount"
        value={amountFromOnline || ""}
        onChange={onChange}
        className="mt-2 w-full border p-2"
      />
    )}

    {(amountDisbursedMethod === "offline" ||
      amountDisbursedMethod === "both") && (
      <input
        type="number"
        name="amountFromOffline"
        placeholder="Offline Amount"
        value={amountFromOffline || ""}
        onChange={onChange}
        className="mt-2 w-full border p-2"
      />
    )}
  </div>
);

export default DisbursalMode;
