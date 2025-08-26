import React, { useState } from "react";

export default function PayTabs({ loan }) {
  const [activeTab, setActiveTab] = useState("interest"); // 'interest' or 'principal'

  return (
    <div className="border rounded-lg shadow p-4">
      {/* ✅ Tabs Header */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "interest"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("interest")}
        >
          Pay Interest
        </button>
        <button
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "principal"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("principal")}
        >
          Pay Principal
        </button>
      </div>

      {/* ✅ Tab Content */}
      <div>
        {activeTab === "interest" && (
          <div>
            <h3 className="text-lg font-bold mb-2">Pay Interest</h3>
            <p>
              <strong>Name:</strong> {loan.customerData.customerName}
            </p>
            <p>
              <strong>Customer ID:</strong> {loan.customerId}
            </p>
            <p>
              <strong>Loan ID:</strong> {loan.loanId}
            </p>
            <p>
              <strong>Loan Amount:</strong> {loan.loanAmount}
            </p>
            <p>
              <strong>Interest Amount:</strong> ₹{loan.interestAmount || "0"}
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Pay Interest
            </button>
          </div>
        )}

        {activeTab === "principal" && (
          <div>
            <h3 className="text-lg font-bold mb-2">Pay Principal</h3>
            <p>
              <strong>Loan ID:</strong> {loan.loanId}
            </p>
            <p>
              <strong>Remaining Principal:</strong> ₹
              {loan.remainingPrincipal || "0"}
            </p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
              Pay Principal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
