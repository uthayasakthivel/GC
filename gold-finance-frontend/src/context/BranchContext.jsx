// contexts/BranchContext.jsx
import { createContext, useContext, useState } from "react";
import { useBranches } from "../hooks/useBranches";

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
  // Fetch branches using existing hook
  const { branches, loading: branchesLoading } = useBranches();

  // Track selected branch (previously inside LoanContext)
  const [selectedBranch, setSelectedBranch] = useState(null);

  return (
    <BranchContext.Provider
      value={{
        branches,
        branchesLoading,
        selectedBranch,
        setSelectedBranch,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranchContext = () => useContext(BranchContext);
