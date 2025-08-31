const BranchSelect = ({ branches, value, onChange }) => (
  <select
    name="branchId"
    value={value}
    onChange={onChange}
    required
    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-700 focus:ring-2 focus:ring-[#00b8db] outline-none"
  >
    <option value="" disabled>
      Select Branch
    </option>
    {branches.map((branch) => (
      <option key={branch._id} value={branch._id}>
        {branch.name}
      </option>
    ))}
  </select>
);

export default BranchSelect;
