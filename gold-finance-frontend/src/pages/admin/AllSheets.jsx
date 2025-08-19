import { useEffect, useState } from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import SubmittedSheetsTable from "../../components/SubmittedSheetsTable";

export default function AllSheets({ sheetType, role = "admin" }) {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await axios.get(`/sheet/${sheetType}-sheet`);
        setSheets(res.data);
      } catch (err) {
        console.error(`Failed to fetch ${sheetType} sheets:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, [sheetType]);

  // Titles and headings can be customized based on sheetType
  const titleMap = {
    buying: "All Submitted Buying Sheets",
    selling: "All Submitted Selling Sheets",
    melting: "All Submitted Melting Sheets",
  };

  return (
    <DashboardLayout role={role}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-amber-900">
          {titleMap[sheetType] || "All Submitted Sheets"}
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : sheets.length === 0 ? (
          <p>No submitted sheets.</p>
        ) : (
          <SubmittedSheetsTable data={sheets} sheetType={sheetType} />
        )}
      </div>
    </DashboardLayout>
  );
}
