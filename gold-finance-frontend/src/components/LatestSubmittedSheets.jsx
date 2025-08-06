import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function LatestSubmittedSheets({ role }) {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await axios.get("/sheet/buying-sheet");
        const latestThree = res.data.slice(0, 3);
        setSheets(latestThree);
      } catch (err) {
        console.error("Error fetching sheets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  return (
    <div className="p-4 text-right">
      <button
        onClick={() => navigate("/buying-sheet")}
        className="text-blue-600 hover:underline"
      >
        Create a new Buying Sheet
      </button>

      {role === "admin" && (
        <div className="flex justify-between items-center mb-4 border-t">
          <h2 className="text-lg font-semibold">Latest Submitted Sheets</h2>
          <button
            onClick={() => navigate("/admin/buying-sheets")}
            className="text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
      )}

      {role === "admin" ? (
        loading ? (
          <p>Loading...</p>
        ) : sheets.length === 0 ? (
          <p className="text-gray-600">No sheets submitted yet.</p>
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
                      {new Date(sheet.date).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => navigate(`/admin/sheets/${sheet._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </div>
  );
}
