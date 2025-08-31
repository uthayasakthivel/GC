import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  branch: Yup.string().required("Branch is required"),
  customerName: Yup.string().required("Name is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Enter 10 digit phone number")
    .required("Phone number is required"),
});

export default function CustomerRegistrationForm({
  branches,
  loadingBranches,
  onSendOtp,
  customerData,
  setCustomerData,
  otpSent,
}) {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        branch: customerData ? customerData.branch : "",
        customerName: customerData ? customerData.customerName : "",
        phoneNumber: customerData ? customerData.phoneNumber : "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        await onSendOtp(values);
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className=" bg-white rounded-xl space-y-6">
          {/* Branch */}
          <div>
            <label
              htmlFor="branch"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Branch
            </label>
            {loadingBranches ? (
              <div className="text-gray-500">Loading branches...</div>
            ) : (
              <Field
                as="select"
                name="branch"
                id="branch"
                className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={otpSent}
                onChange={(e) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    branch: e.target.value,
                  }))
                }
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </Field>
            )}
            <ErrorMessage
              name="branch"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label
              htmlFor="customerName"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Customer Name
            </label>
            <Field
              name="customerName"
              id="customerName"
              type="text"
              className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              disabled={otpSent}
              onChange={(e) =>
                setCustomerData((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
            />
            <ErrorMessage
              name="customerName"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <Field
              name="phoneNumber"
              id="phoneNumber"
              type="text"
              className="w-full pl-3 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              disabled={otpSent}
              onChange={(e) =>
                setCustomerData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
            />
            <ErrorMessage
              name="phoneNumber"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Submit Button */}
          {/* <button
        type="submit"
        disabled={isSubmitting || loadingBranches || otpSent}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
      >
        <CheckCircleIcon className="w-5 h-5" />
        Send OTP
      </button> */}
        </Form>
      )}
    </Formik>
  );
}
