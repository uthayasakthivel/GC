const CommissionInputs = ({
  commissionPersonName,
  commissionPhone,
  commissionFixed,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <input
        type="text"
        name="commissionPersonName"
        placeholder="Commission Person Name"
        value={commissionPersonName}
        onChange={onChange}
        className="w-full border p-2"
      />
      <input
        type="tel"
        name="commissionPhone"
        placeholder="Commission Phone"
        value={commissionPhone}
        onChange={onChange}
        className="w-full border p-2"
      />
      <input
        type="number"
        name="commissionFixed"
        placeholder="Commission Fixed"
        value={commissionFixed}
        onChange={onChange}
        className="w-full border p-2"
      />
    </div>
  );
};

export default CommissionInputs;
