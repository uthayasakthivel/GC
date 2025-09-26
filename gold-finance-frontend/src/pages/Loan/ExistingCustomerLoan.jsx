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
    showOtp,
    otp,
    setOtp,
    otpVerified,
    otpError,
    onSendOtp,
    onOtpVerified,
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
        if (data) setCustomerData(data);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Search Customer */}
          <div>
            <label
              htmlFor="inputValue"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Enter Customer ID or Phone Number
            </label>
            <Field
              name="inputValue"
              id="inputValue"
              type="text"
              className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <ErrorMessage
              name="inputValue"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Fetching..." : "Fetch Customer"}
            </button>
          </div>

          {/* Show Customer Details after fetch */}
          {customerData && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm text-gray-700">
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
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
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
                    onDataChange={(data) =>
                      console.log("Jewellery Data:", data)
                    }
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handlePreview}
                className="w-full mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Preview & Print
              </button>

              {showPreview && (
                <PreviewLoanModal onClose={() => setShowPreview(false)} />
              )}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
