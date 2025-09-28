import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PayTabs from "./PayTabs";
import CustomerDetails from "./CustomerDetails";
import LoanDetailSection from "./LoanDetailSection";
import { useLoan } from "../../context/LoanContext";
import axiosInstance from "../../api/axiosInstance";

export default function LoanDetails() {
  const { id } = useParams();

  const {
    singleLoan,
    setSingleLoan,
    payPrincipal,
    singleLoanLoading,
    fetchSingleLoan,
    interestToPay,
    customerPhoto,
    jewelPhoto,
    aadharPhoto,
    declarationPhoto,
    otherPhoto,
    /** ✅ pull directly from context */
    nextLoanNumber,
    nextLoanNumberLoading,
    branches,
  } = useLoan();

  const [releaseRow, setReleaseRow] = useState(null);
  const [partPaymentAmount, setPartPaymentAmount] = useState(0);

  // load the loan when id changes
  useEffect(() => {
    if (id) fetchSingleLoan(id);
  }, [id]);

  if (singleLoanLoading) return <p>Loading loan details…</p>;
  if (!singleLoan) return <p>No loan found.</p>;

  const handlePayPartial = async () => {
    if (!releaseRow) return;

    const totalDue =
      parseFloat(releaseRow.partial || 0) + parseFloat(interestToPay || 0);
    const enteredAmount = parseFloat(partPaymentAmount);

    if (Math.abs(enteredAmount - totalDue) > 0.01) {
      alert(`Please enter the exact amount: ₹${totalDue.toFixed(2)}`);
      return;
    }

    try {
      const payload = {
        partialJewelOrnament: releaseRow.ornament, // Identify jewel by ornament or better unique id
        paidDate: new Date().toISOString(), // or your payment date input
      };

      const response = await axiosInstance.patch(
        `/loan/${singleLoan._id}/pay-partial`,
        payload
      );

      if (response.data.success) {
        alert("Partial payment processed successfully. New loan created!");
        fetchSingleLoan(singleLoan._id); // reload closed loan
        setReleaseRow(null);
        setPartPaymentAmount(0);
      }
    } catch (err) {
      console.error("Error processing partial payment:", err);
      alert("Failed to process partial payment");
    }
  };

  // Inside your LoanDetails component, just before rendering the jewellery table:

  return (
    <div className="p-4 bg-white shadow rounded">
      <CustomerDetails />
      <LoanDetailSection />

      {/* Partial release status display */}
      {!singleLoan.partialReleaseAllowed && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          Partial Release Status:{" "}
          <strong>{singleLoan.partialReleaseStatus || "Released"}</strong>
        </div>
      )}

      {/* Jewellery Table */}
      <div className="border rounded-lg p-4 bg-white shadow mb-4">
        <h2 className="text-lg font-semibold mb-4">Jewellery Details</h2>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Ornament",
                "No. of Items",
                "Gross Weight",
                "Net Weight",
                "Rate/Gram",
                "Eligible Amount",
                "Partial Amount",
                "Release",
              ].map((label, idx) => (
                <th key={idx} className="border p-2 text-left">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {singleLoan.jewels.map((row, idx) => (
              <tr key={idx}>
                <td>{row.ornament}</td>
                <td>{row.numItems}</td>
                <td>{row.grossWeight}</td>
                <td>{row.netWeight}</td>
                <td>{row.ratePerGram}</td>
                <td>{row.eligibleAmount}</td>
                <td>{row.partial}</td>
                <td>
                  {singleLoan.partialReleaseAllowed ? (
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => setReleaseRow(row)}
                    >
                      Release Partial
                    </button>
                  ) : (
                    <span className="text-gray-500">Not Allowed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Partial Payment Section */}
      {releaseRow && singleLoan.partialReleaseAllowed && (
        <div className="border p-4 rounded shadow mb-4 bg-gray-50">
          <h3 className="text-lg font-bold mb-2">Partial Release</h3>
          <p>
            <strong>Ornament:</strong> {releaseRow.ornament}
          </p>
          <p>
            <strong>Eligible Amount:</strong> {releaseRow.eligibleAmount}
          </p>

          <div className="mt-2">
            <label className="block font-medium mb-1">Partial Amount</label>
            <input
              type="number"
              value={partPaymentAmount}
              onChange={(e) => setPartPaymentAmount(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              Exact Amount to Enter: ₹
              {Number(releaseRow.partial || 0) + interestToPay}
            </p>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            onClick={handlePayPartial}
          >
            Pay Partial & Create New Loan
          </button>
        </div>
      )}

      <PayTabs loan={singleLoan} />
    </div>
  );
}
