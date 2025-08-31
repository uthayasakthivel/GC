const DisbursalMode = ({
  amountDisbursedMethod,
  amountFromOnline,
  amountFromOffline,
  onChange,
}) => (
  <div className="mt-4">
    <label className="block font-semibold text-gray-700 mb-2">
      Disbursal Mode:
    </label>
    <div className="flex gap-6 items-center">
      <label className="flex items-center gap-2 text-gray-700">
        <input
          type="radio"
          name="amountDisbursedMethod"
          value="online"
          checked={amountDisbursedMethod === "online"}
          onChange={onChange}
          className="w-4 h-4 text-[#00b8db] focus:ring-[#00b8db] border-gray-300"
        />
        Online Only
      </label>
      <label className="flex items-center gap-2 text-gray-700">
        <input
          type="radio"
          name="amountDisbursedMethod"
          value="offline"
          checked={amountDisbursedMethod === "offline"}
          onChange={onChange}
          className="w-4 h-4 text-[#00b8db] focus:ring-[#00b8db] border-gray-300"
        />
        Offline Only
      </label>
      <label className="flex items-center gap-2 text-gray-700">
        <input
          type="radio"
          name="amountDisbursedMethod"
          value="both"
          checked={amountDisbursedMethod === "both"}
          onChange={onChange}
          className="w-4 h-4 text-[#00b8db] focus:ring-[#00b8db] border-gray-300"
        />
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
        className="mt-3 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
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
        className="mt-3 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
      />
    )}
  </div>
);

export default DisbursalMode;
