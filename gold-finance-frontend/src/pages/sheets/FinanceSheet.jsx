import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useBranches } from "../../hooks/useBranches";
import { useNextSheetNumber } from "../../hooks/useNextSheetNumber";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import BranchSelect from "../../components/BranchSelect";

const FinanceSheet = () => {
  const [formData, setFormData] = useState({
    branchId: "",
    sheetNumber: "",
    customerName: "",
    phoneNumber: "",
    refPerson: "",
    amountPaid: "",
    interest: 0, // Will be filled from admin dashboard
    disbursedDate: "",
    receivedDate: "",
    noOfDays: 0,
    totalInterest: 0,
    receivedAmount: 0, // ReadOnly
    preparedBy: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { refetch } = useDashboardData();
  const { branches } = useBranches();
  const { nextSheetNumber } = useNextSheetNumber("FinanceSheet");

  // Fetch interest from admin config
  useEffect(() => {
    const fetchInterest = async () => {
      try {
        const res = await axiosInstance.get("/admin/config/interest-rate");
        if (res.data?.rate !== undefined) {
          setFormData((prev) => ({ ...prev, interest: res.data.rate }));
        }
      } catch (err) {
        console.error("Error fetching interest rate:", err);
      }
    };
    fetchInterest();
  }, []);

  // Set sheet number
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      sheetNumber: nextSheetNumber || "",
    }));
  }, [nextSheetNumber]);

  // Auto calculate noOfDays & totalInterest
  useEffect(() => {
    if (formData.disbursedDate && formData.receivedDate) {
      const start = new Date(formData.disbursedDate);
      const end = new Date(formData.receivedDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const interestAmount = parseFloat(formData.interest || 0) * days;
      const receivedAmount =
        parseFloat(formData.amountPaid || 0) + interestAmount;

      setFormData((prev) => ({
        ...prev,
        noOfDays: days,
        totalInterest: interestAmount,
        receivedAmount: receivedAmount,
      }));
    }
  }, [
    formData.disbursedDate,
    formData.receivedDate,
    formData.interest,
    formData.amountPaid,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        createdBy: user?._id,
      };
      await axiosInstance.post("/sheet/finance-sheet", payload);
      alert("Finance Sheet created successfully!");
      await refetch();
      navigate(`/${user?.role}`);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error occurred. Check console for details.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Finance Sheet</h2>
      <h2>Finance Sheet - {nextSheetNumber}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <BranchSelect
          branches={branches}
          value={formData.branchId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={formData.customerName}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="text"
          name="refPerson"
          placeholder="Reference Person"
          value={formData.refPerson}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="amountPaid"
          placeholder="Amount Paid"
          value={formData.amountPaid}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="interest"
          placeholder="Interest Rate"
          value={formData.interest}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />
        <input
          type="date"
          name="disbursedDate"
          value={formData.disbursedDate}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="date"
          name="receivedDate"
          value={formData.receivedDate}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="noOfDays"
          placeholder="Number of Days"
          value={formData.noOfDays}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />
        <input
          type="number"
          name="totalInterest"
          placeholder="Total Interest"
          value={formData.totalInterest}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />
        <input
          type="number"
          name="receivedAmount"
          placeholder="Received Amount"
          value={formData.receivedAmount}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />
        <input
          type="text"
          name="preparedBy"
          placeholder="Prepared By"
          value={formData.preparedBy}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Sheet
        </button>
      </form>
    </div>
  );
};

export default FinanceSheet;
