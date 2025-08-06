const BranchSelect = ({ branches, value, onChange }) => (
  <select name="branchId" value={value} onChange={onChange} required>
    <option value="">Select Branch</option>
    {branches.map((branch) => (
      <option key={branch._id} value={branch._id}>
        {branch.name}
      </option>
    ))}
  </select>
);

export default BranchSelect;
