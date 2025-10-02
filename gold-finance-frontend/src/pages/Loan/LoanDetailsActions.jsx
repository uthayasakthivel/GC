import axiosInstance from "../../api/axiosInstance";
import { usePreviewContext } from "../../context/PreviewContext";

export default function LoanDetailsActions({ loan, onShowPreview }) {
  const { handleGeneratePledgeCard } = usePreviewContext();
  const isOpenLoan = loan?.status !== "loanclosed";

  const generateExistingLoanPledgeCard = async () => {
    try {
      // Fetch the latest loan
      const { data } = await axiosInstance.get(`/loan/${loan._id}`);
      if (!data.success) throw new Error("Failed to fetch loan data");

      const l = data.loan;

      handleGeneratePledgeCard({
        customerData: l.customer, // matches previewData.customerData.customerName
        customerId: l.customer?._id,
        address: l.customer?.address,
        aadharNumber: l.customer?.aadharNumber,
        selectedBranch: l.selectedBranch,
        jewelleryOptions: l.jewels,
        ratePerGram: l.ratePerGram,
        showJewelleryTable: true,
        nextLoanNumber: l.loanNumber,
        loanAmount: l.loanAmount,
        loanDate: l.loanDate,
        loanPeriod: l.loanPeriod,
        dueDate: l.dueDate,
        noOfDays: l.noOfDays,
        selectedFactor: l.factor,
        totalInterest: l.totalInterest,
        paymentMethod: l.paymentMethod,
        paymentByOffline: l.paymentByOffline,
        paymentByOnline: l.paymentByOnline,
        refNumber: l.refNumber,
        customerPhoto: l.customerPhoto,
        jewelPhoto: l.jewelPhoto,
        aadharPhoto: l.aadharPhoto,
        declarationPhoto: l.declarationPhoto,
        otherPhoto: l.otherPhoto,
        sheetPreparedBy: l.sheetPreparedBy,
        branches: [],
        branchesLoading: false,
        defaultLoanDate: new Date(),
        defaultLoanPeriod: 6,
        isExistingLoan: true,
      });

      // Trigger modal in parent
      onShowPreview(true);
    } catch (err) {
      console.error(err);
      alert("Failed to generate pledge card");
    }
  };

  if (!isOpenLoan) return null;

  return (
    <button
      onClick={generateExistingLoanPledgeCard}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Generate Pledge Card (Existing Loan)
    </button>
  );
}
