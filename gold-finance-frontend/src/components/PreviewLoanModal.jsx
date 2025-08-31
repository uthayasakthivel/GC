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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Preview Loan Details</h2>

        {/* Display preview data */}
        <div className="mb-4 max-h-[500px] overflow-y-auto border p-4 rounded">
          <p className="underline font-bold mb-2">Customer Data</p>
          <p>
            <strong>Customer Name:</strong>{" "}
            {previewData?.customerData?.customerName}
          </p>
          <p>
            <strong>Phone Number:</strong>{" "}
            {previewData?.customerData?.phoneNumber}
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
            <strong>Aadhar Number:</strong> {previewData?.aadharNumber}
          </p>
          <p>
            <strong>Selected Branch:</strong>{" "}
            {previewData?.selectedBranch?.name}
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

          {/* Images */}
          <div className="flex flex-wrap gap-4 mt-2">
            {previewData?.customerPhoto && (
              <div>
                <strong>Customer Photo:</strong>
                <img
                  src={URL.createObjectURL(previewData.customerPhoto)}
                  alt="Customer"
                  className="w-20 h-20 object-cover mt-1 rounded border"
                />
              </div>
            )}
            {previewData?.jewelPhoto && (
              <div>
                <strong>Jewel Photo:</strong>
                <img
                  src={URL.createObjectURL(previewData.jewelPhoto)}
                  alt="Jewel"
                  className="w-20 h-20 object-cover mt-1 rounded border"
                />
              </div>
            )}
            {previewData?.aadharPhoto && (
              <div>
                <strong>Aadhar Photo:</strong>
                <img
                  src={URL.createObjectURL(previewData.aadharPhoto)}
                  alt="Aadhar"
                  className="w-20 h-20 object-cover mt-1 rounded border"
                />
              </div>
            )}
            {previewData?.declarationPhoto && (
              <div>
                <strong>Declaration Photo:</strong>
                <img
                  src={URL.createObjectURL(previewData.declarationPhoto)}
                  alt="Declaration"
                  className="w-20 h-20 object-cover mt-1 rounded border"
                />
              </div>
            )}
            {previewData?.otherPhoto && (
              <div>
                <strong>Other Photo:</strong>
                <img
                  src={URL.createObjectURL(previewData.otherPhoto)}
                  alt="Other"
                  className="w-20 h-20 object-cover mt-1 rounded border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Hidden Print Sections */}
        <div style={{ display: "none" }}>
          <div id="customer-print">
            <h2>Customer Copy</h2>
            <p>Name: {previewData?.customerData?.customerName}</p>
            <p>Loan Amount: ₹{previewData?.loanAmount}</p>
            <p>Branch: {previewData?.selectedBranch?.name}</p>
            <p>
              Loan Date: {new Date(previewData?.loanDate).toLocaleDateString()}
            </p>
          </div>

          <div
            id="official-print"
            style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
              Official Copy
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 150px",
                gap: "10px",
                fontSize: "14px",
              }}
            >
              {/* Customer Name */}
              <div>
                <strong>Customer Name:</strong>{" "}
                {previewData?.customerData?.customerName}
              </div>
              {previewData?.customerPhoto && (
                <img
                  src={URL.createObjectURL(previewData.customerPhoto)}
                  alt="Customer"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              )}

              {/* Phone Number */}
              <div>
                <strong>Phone Number:</strong>{" "}
                {previewData?.customerData?.phoneNumber}
              </div>

              {/* Loan Amount */}
              <div>
                <strong>Loan Amount:</strong> ₹{previewData?.loanAmount}
              </div>

              {/* Customer ID */}
              <div>
                <strong>Customer ID:</strong> {previewData?.customerId}
              </div>

              {/* Address */}
              <div>
                <strong>Address:</strong> {previewData?.address}
              </div>

              {/* Aadhar Number */}
              <div>
                <strong>Aadhar Number:</strong> {previewData?.aadharNumber}
              </div>
              {previewData?.aadharPhoto && (
                <img
                  src={URL.createObjectURL(previewData.aadharPhoto)}
                  alt="Aadhar"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              )}

              {/* Jewel Photo */}
              {previewData?.jewelPhoto && (
                <>
                  <div>
                    <strong>Jewel:</strong>
                  </div>
                  <img
                    src={URL.createObjectURL(previewData.jewelPhoto)}
                    alt="Jewel"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                </>
              )}

              {/* Declaration Photo */}
              {previewData?.declarationPhoto && (
                <>
                  <div>
                    <strong>Declaration:</strong>
                  </div>
                  <img
                    src={URL.createObjectURL(previewData.declarationPhoto)}
                    alt="Declaration"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                </>
              )}

              {/* Other Photo */}
              {previewData?.otherPhoto && (
                <>
                  <div>
                    <strong>Other:</strong>
                  </div>
                  <img
                    src={URL.createObjectURL(previewData.otherPhoto)}
                    alt="Other"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                </>
              )}

              {/* Remaining Details */}
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
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handlePrintCustomer}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            disabled={!previewData}
          >
            Print Customer Copy
          </button>

          <button
            onClick={handlePrintOfficial}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Print Official Copy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
