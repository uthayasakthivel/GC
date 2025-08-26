import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import PayTabs from "./PayTabs";
import { useLoan } from "../../context/LoanContext";

export default function LoanDetailsPage() {
  const { id } = useParams();
  const {
    singleLoan,
    setSingleLoan,
    singelLoanLoading,
    setSingelLoanLoading,
    fetchSingleLoan,
    noOfDaysLoan,
    interestToPay,
  } = useLoan();
  useEffect(() => {
    fetchSingleLoan(id);
  }, [id]);

  if (singelLoanLoading) return <p>Loading singleLoan details...</p>;
  if (!singleLoan) return <p>No singleLoan found.</p>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Loan Details</h2>

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
        <strong>Address:</strong> {singleLoan.customerData?.address}
      </p>
      <p>
        <strong>Aadhar Number:</strong> {singleLoan.customerData?.aadharNumber}
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

      <h2 className="text-xl font-bold mb-4 underline">Loan Details</h2>
      <p>
        <strong>Loan ID:</strong> {singleLoan.loanId}
      </p>
      <p>
        <strong>Loan Amount:</strong> ₹{singleLoan.loanAmount}
      </p>
      <p>
        <strong>Loan Duration:</strong> {singleLoan.loanPeriod} Months
      </p>
      <p>
        <strong>Factor:</strong> {singleLoan.selectedFactor}
      </p>
      <p>
        <strong>Loan Date:</strong>{" "}
        {new Date(singleLoan.loanDate).toLocaleDateString("en-GB")}
      </p>
      <p>
        <strong>Loan Due Date:</strong>{" "}
        {new Date(singleLoan.dueDate).toLocaleDateString("en-GB")}
      </p>
      <p>
        <strong>Today:</strong> {new Date().toLocaleDateString("en-GB")}
      </p>
      <p>
        <strong>Last Interest Paid On:</strong>{" "}
        {singleLoan?.lastInterestPaidDate
          ? new Date(singleLoan.lastInterestPaidDate).toLocaleDateString(
              "en-GB"
            )
          : "Not paid yet"}
      </p>

      <p>
        <strong>No. of Days:</strong> {noOfDaysLoan}
      </p>

      <p>
        <strong>Interest Needs to Pay:</strong> ₹{interestToPay.toFixed(2)}
      </p>

      <PayTabs loan={singleLoan} />
    </div>
  );
}
