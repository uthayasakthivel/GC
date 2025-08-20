// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const validationSchema = Yup.object({
//   branch: Yup.string().required("Branch is required"),
//   customerName: Yup.string().required("Name is required"),
//   phoneNumber: Yup.string()
//     .matches(/^\d{10}$/, "Enter 10 digit phone number")
//     .required("Phone number is required"),
//   address: Yup.string().required("Address is required"),
//   aadharNumber: Yup.string()
//     .matches(/^\d{12}$/, "Enter 12 digit Aadhaar")
//     .required("Aadhaar number is required"),
// });

// export default function CustomerRegistrationForm({
//   branches,
//   loadingBranches,
//   onSendOtp,
// }) {
//   return (
//     <Formik
//       initialValues={{
//         branch: "",
//         customerName: "",
//         phoneNumber: "",
//         address: "",
//         aadharNumber: "",
//       }}
//       validationSchema={validationSchema}
//       onSubmit={async (values, actions) => {
//         await onSendOtp(values);
//         actions.setSubmitting(false);
//       }}
//     >
//       {({ isSubmitting, values }) => (
//         <Form className="max-w-md mx-auto p-6 border rounded-md shadow-md">
//           <div className="mb-4">
//             <label htmlFor="branch" className="block mb-1 font-semibold">
//               Branch
//             </label>
//             {loadingBranches ? (
//               <div>Loading branches...</div>
//             ) : (
//               <Field
//                 as="select"
//                 name="branch"
//                 id="branch"
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               >
//                 <option value="">Select Branch</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </Field>
//             )}
//             <ErrorMessage
//               name="branch"
//               component="div"
//               className="text-red-600 text-sm mt-1"
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="customerName" className="block mb-1 font-semibold">
//               Customer Name
//             </label>
//             <Field
//               name="customerName"
//               id="customerName"
//               type="text"
//               className="w-full border px-3 py-2 rounded"
//             />
//             <ErrorMessage
//               name="customerName"
//               component="div"
//               className="text-red-600 text-sm mt-1"
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="phoneNumber" className="block mb-1 font-semibold">
//               Phone Number
//             </label>
//             <Field
//               name="phoneNumber"
//               id="phoneNumber"
//               type="text"
//               className="w-full border px-3 py-2 rounded"
//             />
//             <ErrorMessage
//               name="phoneNumber"
//               component="div"
//               className="text-red-600 text-sm mt-1"
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="address" className="block mb-1 font-semibold">
//               Address
//             </label>
//             <Field
//               name="address"
//               id="address"
//               type="text"
//               className="w-full border px-3 py-2 rounded"
//             />
//             <ErrorMessage
//               name="address"
//               component="div"
//               className="text-red-600 text-sm mt-1"
//             />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="aadharNumber" className="block mb-1 font-semibold">
//               Aadhaar Number
//             </label>
//             <Field
//               name="aadharNumber"
//               id="aadharNumber"
//               type="text"
//               className="w-full border px-3 py-2 rounded"
//             />
//             <ErrorMessage
//               name="aadharNumber"
//               component="div"
//               className="text-red-600 text-sm mt-1"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting || loadingBranches || values.branch === ""}
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//           >
//             Send OTP
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// }

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
        <Form className="max-w-md mx-auto p-6 border rounded-md shadow-md">
          <div className="mb-4">
            <label htmlFor="branch" className="block mb-1 font-semibold">
              Branch
            </label>
            {loadingBranches ? (
              <div>Loading branches...</div>
            ) : (
              <Field
                as="select"
                name="branch"
                id="branch"
                className="w-full border px-3 py-2 rounded"
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

          <div className="mb-4">
            <label htmlFor="customerName" className="block mb-1 font-semibold">
              Customer Name
            </label>
            <Field
              name="customerName"
              id="customerName"
              type="text"
              className="w-full border px-3 py-2 rounded"
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

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block mb-1 font-semibold">
              Phone Number
            </label>
            <Field
              name="phoneNumber"
              id="phoneNumber"
              type="text"
              className="w-full border px-3 py-2 rounded"
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

          {/* <button
            type="submit"
            disabled={isSubmitting || loadingBranches || otpSent}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Send OTP
          </button> */}
        </Form>
      )}
    </Formik>
  );
}
