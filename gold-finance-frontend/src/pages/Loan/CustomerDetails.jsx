import { useLoan } from "../../context/LoanContext";

const CustomerDetails = () => {
  const { singleLoan } = useLoan();
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 underline">Customer Details</h2>
      <p>
        <strong>Customer ID:</strong> {singleLoan.customerId}
      </p>
      <p>
        <strong>Phone number:</strong> {singleLoan?.customerData?.phoneNumber}
      </p>
      <p>
        <strong>Customer Name:</strong> {singleLoan.customerData?.customerName}
      </p>
      <p>
        <strong>Address:</strong> {singleLoan.address}
      </p>
      <p>
        <strong>Aadhar Number:</strong> {singleLoan.aadharNumber}
      </p>

      {singleLoan.images?.customerPhoto && (
        <div className="mt-4">
          <strong>Customer Photo:</strong>
          <img
            src={`http://localhost:5000/${singleLoan.images.customerPhoto}`}
            alt="Customer"
            className="w-32 h-32 object-cover mt-2"
          />
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
