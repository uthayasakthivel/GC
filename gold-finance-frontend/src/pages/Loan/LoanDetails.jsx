import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PayTabs from "./PayTabs";
import { useLoan } from "../../context/LoanContext";
import CustomerDetails from "./CustomerDetails";
import LoanDetailSection from "./LoanDetailSection";
import JewelDetails from "./JewelDetails";

export default function LoanDetails() {
  const { id } = useParams();
  const { singleLoan, singelLoanLoading, fetchSingleLoan } = useLoan();

  useEffect(() => {
    fetchSingleLoan(id);
  }, [id]);

  if (singelLoanLoading) return <p>Loading singleLoan details...</p>;
  if (!singleLoan) return <p>No singleLoan found.</p>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <CustomerDetails />
      <LoanDetailSection />
      <JewelDetails
        columns={[
          { key: "ornament", label: "Ornament", input: true, type: "text" },
          {
            key: "numItems",
            label: "No. of Items",
            input: true,
            type: "number",
            min: 1,
          },
          {
            key: "grossWeight",
            label: "Gross Weight",
            input: true,
            type: "number",
            step: "0.01",
          },
          {
            key: "netWeight",
            label: "Net Weight",
            input: true,
            type: "number",
            step: "0.01",
          },
          {
            key: "ratePerGram",
            label: "Rate/Gram",
            input: true,
            type: "number",
            readOnly: true,
          },
          { key: "eligibleAmount", label: "Eligible Amount" },
          { key: "partial", label: "Partial Amount" },
        ]}
      />

      <PayTabs loan={singleLoan} />
    </div>
  );
}
