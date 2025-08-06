import { useEffect, useState } from "react";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AllBuyingSheets() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Sheet No</th>
                  <th className="border p-2 text-left">Customer Name</th>
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {sheets.map((sheet) => (
                  <tr key={sheet._id} className="hover:bg-gray-50">
                    <td className="border p-2">{sheet.sheetNumber}</td>
                    <td className="border p-2">{sheet.customerName}</td>
                    <td className="border p-2">
                      {new Date(sheet.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => navigate(`/admin/sheets/${sheet._id}`)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                      >
                        Preview
                      </button>
                      {/* Print and download will be handled in preview screen */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
