// LatestSubmittedSheets.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function LatestSubmittedSheets({ role, sheetType }) {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log(role, "role in latest submitted sheets");
  useEffect(() => {
    let mounted = true;

    const fetchSheets = async () => {
      setLoading(true);
      try {
        const endpoint = `/sheet/${sheetType}-sheet`;
        const res = await axios.get(endpoint);
        const latestThree = Array.isArray(res.data) ? res.data.slice(0, 3) : [];
        if (mounted) setSheets(latestThree);
      } catch (err) {
        console.error(`Error fetching ${sheetType} sheets:`, err);
        if (mounted) setSheets([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSheets();
    return () => {
      mounted = false;
    };
  }, [sheetType]);

  const pretty = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="rounded-xl">
      {/* Header + Buttons in One Line */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#313485]">
          Latest Submitted {pretty(sheetType)} Sheets
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/${sheetType}-sheet`)}
            className="bg-gradient-to-r from-[#00b8db] to-[#313485] text-white font-semibold px-6 py-2 rounded-lg shadow hover:scale-105 transition-all duration-300"
          >
            ➕ Create New
          </button>
          <button
            onClick={() => navigate(`/admin/${sheetType}-sheets`)}
            className="bg-gradient-to-r from-[#313485] to-[#00b8db] text-white px-4 py-2 rounded-lg font-medium shadow hover:scale-105 transition-all duration-300"
          >
            View All
          </button>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading...</p>
      ) : sheets.length === 0 ? (
        <p className="text-gray-600 italic">No sheets submitted yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200  shadow-lg ">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#313485] to-[#00b8db] text-white">
              <tr>
                <th className="p-3 text-left font-semibold">Sheet No</th>
                {sheetType !== "melting" && (
                  <th className="p-3 text-left font-semibold">Customer</th>
                )}
                <th className="p-3 text-left font-semibold">Date</th>
                {sheetType === "buying" && (
                  <th className="p-3 text-left font-semibold">Status</th>
                )}
                <th className="p-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sheets.map((sheet) => (
                <tr
                  key={sheet._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">{sheet.sheetNumber}</td>
                  {sheetType !== "melting" && (
                    <td className="p-3">{sheet.customerName}</td>
                  )}
                  <td className="p-3">
                    {new Date(sheet.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {sheetType === "buying" && (
                    <td className="p-3">
                      {sheet.sold ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Sold
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                          Open
                        </span>
                      )}
                    </td>
                  )}
                  <td className="p-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/sheets/${sheetType}/${sheet._id}`)
                      }
                      className="bg-gradient-to-r from-[#313485] to-[#00b8db] hover:from-[#00b8db] hover:to-[#313485] text-white px-4 py-1 rounded-lg shadow-sm hover:scale-105 transition"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
