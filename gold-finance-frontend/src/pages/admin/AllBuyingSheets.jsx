import { useEffect, useState } from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import SubmittedSheetsTable from "../../components/SubmittedSheetsTable";

export default function AllBuyingSheets() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await axios.get("/sheet/buying-sheet");
        setSheets(res.data);
      } catch (err) {
        console.error("Failed to fetch sheets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-amber-900">
          All Submitted Buying Sheets
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : sheets.length === 0 ? (
          <p>No submitted sheets.</p>
        ) : (
          <SubmittedSheetsTable data={sheets} />
        )}
      </div>
    </DashboardLayout>
  );
}
