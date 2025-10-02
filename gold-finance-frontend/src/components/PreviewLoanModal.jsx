import { useLoan } from "../context/LoanContext";
import axiosInstance from "../api/axiosInstance";
import printJS from "print-js";
import { usePreviewContext } from "../context/PreviewContext";
import { useJewellery } from "../context/JewelleryContext";
import { useCustomerContext } from "../context/CustomerContext";

export default function PreviewModal({ onClose }) {
  const { generateFormData, resetLoanForm } = useLoan();
  const { previewData, resetPreviewData } = usePreviewContext();
  const { resetJewellery } = useJewellery();
  const { resetCustomerState } = useCustomerContext();

  console.log(previewData, "pppppppp");

  const handlePrintCustomer = () => {
    alert(1);
    printJS({
      printable: "customer-print",
      type: "html",
      style: `
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 10px; }
        p { margin: 4px 0; font-size: 14px; }
        .section-title { text-decoration: underline; font-weight: bold; margin-top: 10px; }
      `,
    });
  };

  const handlePrintOfficial = () => {
    printJS({
      printable: "official-print",
      type: "html",
      style: `
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 10px; }
        p { margin: 4px 0; font-size: 14px; }
        .section-title { text-decoration: underline; font-weight: bold; margin-top: 10px; }
      `,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!previewData) {
        alert("No data to submit");
        return;
      }

      // pass previewData as formValues
      const formData = generateFormData(previewData);

      const res = await axiosInstance.post("/loan/create-loan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Loan Created Successfully!");
      console.log(res.data);
      resetLoanForm(); // resets loan details
      resetJewellery();
      resetCustomerState();
      resetPreviewData();
      onClose(); // close modal
    } catch (error) {
      console.error(error);
      alert("Error submitting loan");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto p-4 pt-10 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Preview Loan Details
        </h2>

        {/* Preview Details */}
        <div className="mb-6 max-h-[500px] overflow-y-auto border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-3">
          <p className="underline font-semibold mb-2 text-gray-700">
            Customer Data
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
            <p>
              <strong>Name:</strong> {previewData?.customerData?.customerName}
            </p>
            <p>
              <strong>Phone:</strong> {previewData?.customerData?.phoneNumber}
            </p>
            <p>
              <strong>Loan Amount:</strong> ₹{previewData?.loanAmount}
            </p>
            <p>
              <strong>Customer ID:</strong> {previewData?.customerId}
            </p>
            <p>
              <strong>Address:</strong> {previewData?.address}
            </p>
            <p>
              <strong>Aadhaar:</strong> {previewData?.aadharNumber}
            </p>
            <p>
              <strong>Branch:</strong> {previewData?.selectedBranch?.name}
            </p>
            <p>
              <strong>Rate Per Gram:</strong> ₹{previewData?.ratePerGram}
            </p>
            <p>
              <strong>Loan Date:</strong>{" "}
              {new Date(previewData?.loanDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Loan Period:</strong> {previewData?.loanPeriod} months
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(previewData?.dueDate).toLocaleDateString()}
            </p>
            <p>
              <strong>No. of Days:</strong> {previewData?.noOfDays}
            </p>
            <p>
              <strong>Total Interest:</strong> ₹{previewData?.totalInterest}
            </p>
            <p>
              <strong>Payment Method:</strong> {previewData?.paymentMethod}
            </p>
            <p>
              <strong>Reference Number:</strong> {previewData?.refNumber}
            </p>
            <p>
              <strong>Sheet Prepared By:</strong> {previewData?.sheetPreparedBy}
            </p>
            <p>
              <strong>Next Loan Number:</strong> {previewData?.nextLoanNumber}
            </p>
          </div>

          {/* Images */}
          <div className="flex flex-wrap gap-4 mt-4">
            {previewData?.customerPhoto && (
              <div>
                <p className="font-medium mb-1">Customer Photo:</p>
                <img
                  src={URL.createObjectURL(previewData.customerPhoto)}
                  alt="Customer"
                  className="w-24 h-24 object-cover rounded border"
                />
              </div>
            )}
            {previewData?.jewelPhoto && (
              <div>
                <p className="font-medium mb-1">Jewel Photo:</p>
                <img
                  src={URL.createObjectURL(previewData.jewelPhoto)}
                  alt="Jewel"
                  className="w-24 h-24 object-cover rounded border"
                />
              </div>
            )}
            {previewData?.aadharPhoto && (
              <div>
                <p className="font-medium mb-1">Aadhaar Photo:</p>
                <img
                  src={URL.createObjectURL(previewData.aadharPhoto)}
                  alt="Aadhaar"
                  className="w-24 h-24 object-cover rounded border"
                />
              </div>
            )}
            {previewData?.declarationPhoto && (
              <div>
                <p className="font-medium mb-1">Declaration Photo:</p>
                <img
                  src={URL.createObjectURL(previewData.declarationPhoto)}
                  alt="Declaration"
                  className="w-24 h-24 object-cover rounded border"
                />
              </div>
            )}
            {previewData?.otherPhoto && (
              <div>
                <p className="font-medium mb-1">Other Photo:</p>
                <img
                  src={URL.createObjectURL(previewData.otherPhoto)}
                  alt="Other"
                  className="w-24 h-24 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Hidden Print Sections */}
        <div style={{ display: "none" }}>
          {/* Customer Copy */}
          <div id="customer-print" className="p-4 font-sans">
            <h2 className="text-lg font-bold mb-2">Customer Copy</h2>
            <p>
              <strong>Name:</strong> {previewData?.customerData?.customerName}
            </p>
            <p>
              <strong>Loan Amount:</strong> ₹{previewData?.loanAmount}
            </p>
            <p>
              <strong>Branch:</strong> {previewData?.selectedBranch?.name}
            </p>
            <p>
              <strong>Loan Date:</strong>{" "}
              {new Date(previewData?.loanDate).toLocaleDateString()}
            </p>
          </div>

          {/* Official Copy */}
          <div id="official-print" className="p-4 font-sans">
            <h2 className="text-lg font-bold text-center mb-4">
              Official Copy
            </h2>
            <div className="grid grid-cols-[1fr_150px] gap-2 text-sm">
              <div>
                <strong>Customer Name:</strong>{" "}
                {previewData?.customerData?.customerName}
              </div>
              {previewData?.customerPhoto && (
                <img
                  src={URL.createObjectURL(previewData.customerPhoto)}
                  alt="Customer"
                  className="w-20 h-20 object-cover border rounded"
                />
              )}

              <div>
                <strong>Phone Number:</strong>{" "}
                {previewData?.customerData?.phoneNumber}
              </div>
              <div>
                <strong>Loan Amount:</strong> ₹{previewData?.loanAmount}
              </div>
              <div>
                <strong>Customer ID:</strong> {previewData?.customerId}
              </div>
              <div>
                <strong>Address:</strong> {previewData?.address}
              </div>
              <div>
                <strong>Aadhar Number:</strong> {previewData?.aadharNumber}
              </div>
              {previewData?.aadharPhoto && (
                <img
                  src={URL.createObjectURL(previewData.aadharPhoto)}
                  alt="Aadhar"
                  className="w-20 h-20 object-cover border rounded"
                />
              )}

              {previewData?.jewelPhoto && (
                <>
                  <div>
                    <strong>Jewel:</strong>
                  </div>
                  <img
                    src={URL.createObjectURL(previewData.jewelPhoto)}
                    alt="Jewel"
                    className="w-20 h-20 object-cover border rounded"
                  />
                </>
              )}

              {previewData?.declarationPhoto && (
                <>
                  <div>
                    <strong>Declaration:</strong>
                  </div>
                  <img
                    src={URL.createObjectURL(previewData.declarationPhoto)}
                    alt="Declaration"
                    className="w-20 h-20 object-cover border rounded"
                  />
                </>
              )}

              {previewData?.otherPhoto && (
                <>
                  <div>
                    <strong>Other:</strong>
                  </div>
                  <img
                    src={URL.createObjectURL(previewData.otherPhoto)}
                    alt="Other"
                    className="w-20 h-20 object-cover border rounded"
                  />
                </>
              )}

              <div>
                <strong>Branch:</strong> {previewData?.selectedBranch?.name}
              </div>
              <div>
                <strong>Rate Per Gram:</strong> ₹{previewData?.ratePerGram}
              </div>
              <div>
                <strong>Loan Date:</strong>{" "}
                {new Date(previewData?.loanDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Loan Period:</strong> {previewData?.loanPeriod} months
              </div>
              <div>
                <strong>Due Date:</strong>{" "}
                {new Date(previewData?.dueDate).toLocaleDateString()}
              </div>
              <div>
                <strong>No. of Days:</strong> {previewData?.noOfDays}
              </div>
              <div>
                <strong>Total Interest:</strong> ₹{previewData?.totalInterest}
              </div>
              <div>
                <strong>Payment Method:</strong> {previewData?.paymentMethod}
              </div>
              <div>
                <strong>Reference Number:</strong> {previewData?.refNumber}
              </div>
              <div>
                <strong>Sheet Prepared By:</strong>{" "}
                {previewData?.sheetPreparedBy}
              </div>
              <div>
                <strong>Next Loan Number:</strong> {previewData?.nextLoanNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-3 mt-4">
          <button
            onClick={handlePrintCustomer}
            // disabled={!previewData}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Print Customer Copy
          </button>
          <button
            onClick={handlePrintOfficial}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Print Official Copy
          </button>
          {/* Submit button only for new loans */}
          {!previewData?.isExistingLoan && (
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Submit
            </button>
          )}

          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
