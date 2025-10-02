// PreviewContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

// 1. Create context
const PreviewContext = createContext();

// 2. Provider component
export const PreviewProvider = ({ children }) => {
  const [previewData, setPreviewData] = useState(null);

  // 3. Function to generate preview data
  // Accept dependencies via parameters!
  const handleGeneratePledgeCard = useCallback(
    ({
      customerData,
      customerId,
      address,
      aadharNumber,
      selectedBranch,
      jewelleryOptions,
      ratePerGram,
      showJewelleryTable,
      configLoading,
      nextLoanNumber,
      nextLoanNumberLoading,
      loanAmount,
      allInterestRates,
      selectedInterestRate,
      loanDate,
      loanPeriod,
      dueDate,
      noOfDays,
      selectedFactor,
      totalInterest,
      paymentMethod,
      paymentByOffline,
      paymentByOnline,
      refNumber,
      customerPhoto,
      jewelPhoto,
      aadharPhoto,
      declarationPhoto,
      otherPhoto,
      sheetPreparedBy,
      branches,
      branchesLoading,
      defaultLoanDate,
      defaultLoanPeriod,
      isExistingLoan = false,
    }) => {
      setPreviewData({
        customerData,
        customerId,
        address,
        aadharNumber,
        selectedBranch,
        jewelleryOptions,
        ratePerGram,
        showJewelleryTable,
        configLoading,
        nextLoanNumber,
        nextLoanNumberLoading,
        loanAmount,
        allInterestRates,
        selectedInterestRate,
        loanDate,
        loanPeriod,
        dueDate,
        noOfDays,
        selectedFactor,
        totalInterest,
        paymentMethod,
        paymentByOffline,
        paymentByOnline,
        refNumber,
        customerPhoto,
        jewelPhoto,
        aadharPhoto,
        declarationPhoto,
        otherPhoto,
        sheetPreparedBy,
        branches,
        branchesLoading,
        defaultLoanDate,
        defaultLoanPeriod,
        isExistingLoan,
      });
    },
    []
  );

  const resetPreviewData = useCallback(() => {
    setPreviewData(null);
  }, []);

  return (
    <PreviewContext.Provider
      value={{
        previewData,
        setPreviewData,
        handleGeneratePledgeCard,
        resetPreviewData,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

// 4. Custom hook for accessing context
export const usePreviewContext = () => useContext(PreviewContext);
