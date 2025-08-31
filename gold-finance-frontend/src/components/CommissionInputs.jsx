const CommissionInputs = ({
  commissionPersonName,
  commissionPhone,
  commissionFixed,
  onChange,
}) => {
  return (
    <div className="space-y-3">
      <input
        type="text"
        name="commissionPersonName"
        placeholder="Commission Person Name"
        value={commissionPersonName}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
      />
      <input
        type="tel"
        name="commissionPhone"
        placeholder="Commission Phone"
        value={commissionPhone}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
      />
      <input
        type="number"
        name="commissionFixed"
        placeholder="Commission Fixed"
        value={commissionFixed}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00b8db] outline-none"
      />
    </div>
  );
};

export default CommissionInputs;
