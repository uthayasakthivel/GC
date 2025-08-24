import React from "react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoan } from "../../context/LoanContext";
import DynamicJewelleryTable from "../../components/DynamicJewelleryTable";
import PreviewLoanModal from "../../components/PreviewLoanModal";

const validationSchema = Yup.object({
  inputValue: Yup.string()
    .required("Customer ID or Phone is required")
    .matches(/^\d{10}$|^[A-Za-z0-9]+$/, "Enter valid Phone (10 digits) or ID"),
});

export default function ExistingCustomerLoan() {
  const {
    fetchCustomerByIdOrPhone,
    customerData,
    setCustomerData,
    // showOtp,
    // otp,
    // setOtp,
    // otpVerified,
    // otpError,
    // onSendOtp,
    // onOtpVerified,
    showJewelleryTable,
    setShowJewelleryTable,
  } = useLoan();

  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <Formik
      initialValues={{ inputValue: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const data = await fetchCustomerByIdOrPhone(values.inputValue);
        if (data) {
          setCustomerData(data);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="p-4 border rounded shadow max-w-md mx-auto">
          {/* Search Customer */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              Enter Customer ID or Phone Number
            </label>
            <Field
              name="inputValue"
              type="text"
              className="w-full px-3 py-2 border rounded mb-1"
            />
            <ErrorMessage
              name="inputValue"
              component="div"
              className="text-red-600 text-sm mb-2"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white w-full px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {isSubmitting ? "Fetching..." : "Fetch Customer"}
            </button>
          </div>

          {/* Show Customer Details after fetch */}
          {customerData && (
            <>
              <div className="mt-4 p-3 border rounded bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
                <p>
                  <strong>Name:</strong> {customerData.customerName}
                </p>
                <p>
                  <strong>Phone:</strong> {customerData.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {customerData.address}
                </p>
                <p>
                  <strong>Aadhaar:</strong> {customerData.aadharNumber}
                </p>
              </div>

              <button
                type="button"
                className="bg-gray-800 text-white w-full px-4 py-2 rounded mt-4 hover:bg-gray-900 transition"
                onClick={() => setShowJewelleryTable(true)}
              >
                Add Jewellery Details
              </button>
              {showJewelleryTable && (
                <div className="mt-4">
                  <DynamicJewelleryTable
                    initialRows={[]}
                    columns={[
                      {
                        key: "ornament",
                        label: "Ornaments",
                        input: true,
                        type: "select",
                      },
                      {
                        key: "numItems",
                        label: "No of items",
                        input: true,
                        type: "number",
                        min: 1,
                      },
                      {
                        key: "grossWeight",
                        label: "Gross weight",
                        input: true,
                        type: "number",
                        step: "0.01",
                      },
                      {
                        key: "netWeight",
                        label: "Net weight",
                        input: true,
                        type: "number",
                        step: "0.01",
                      },
                      {
                        key: "ratePerGram",
                        label: "Rate per gram",
                        input: true,
                        type: "number",
                        readOnly: true,
                      },
                      {
                        key: "eligibleAmount",
                        label: "Eligible amount",
                        input: false,
                      },
                      { key: "partial", label: "Partial", input: false },
                    ]}
                    onDataChange={(data) => {
                      console.log("Jewellery Data:", data);
                    }}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handlePreview}
                className="bg-blue-600 text-white w-full px-4 py-2 rounded mt-6"
              >
                Preview & Print
              </button>

              {showPreview && (
                <PreviewLoanModal onClose={() => setShowPreview(false)} />
              )}
            </>
          )}
        </Form>
      )}
    </Formik>
  );
}
