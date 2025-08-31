import { useLoan } from "../../context/LoanContext";
import {
  IdentificationIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  FingerPrintIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const CustomerDetails = () => {
  const { singleLoan } = useLoan();

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl space-y-4">
      {/* Header */}
      <div className="mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
        <IdentificationIcon className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Customer Details
        </h2>
      </div>

      {/* Details */}
      <div className="space-y-3 text-gray-700 text-base">
        <p className="flex items-center gap-2">
          <IdentificationIcon className="w-5 h-5 text-gray-500" />
          <span>
            <strong>Customer ID:</strong> {singleLoan.customerId}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <PhoneIcon className="w-5 h-5 text-gray-500" />
          <span>
            <strong>Phone number:</strong>{" "}
            {singleLoan?.customerData?.phoneNumber}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-gray-500" />
          <span>
            <strong>Customer Name:</strong>{" "}
            {singleLoan.customerData?.customerName}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-gray-500" />
          <span>
            <strong>Address:</strong> {singleLoan.address}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <FingerPrintIcon className="w-5 h-5 text-gray-500" />
          <span>
            <strong>Aadhar Number:</strong> {singleLoan.aadharNumber}
          </span>
        </p>

        {singleLoan.images?.customerPhoto && (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <PhotoIcon className="w-5 h-5 text-gray-500" />
              <strong>Customer Photo:</strong>
            </div>
            <img
              src={`http://localhost:5000/${singleLoan.images.customerPhoto}`}
              alt="Customer"
              className="w-32 h-32 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
