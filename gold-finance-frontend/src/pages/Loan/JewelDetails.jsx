function getTotals(data) {
  return {
    totalUnits: data.reduce((sum, row) => sum + Number(row.numItems || 0), 0),
    totalGross: data.reduce(
      (sum, row) => sum + Number(row.grossWeight || 0),
      0
    ),
    totalNet: data.reduce((sum, row) => sum + Number(row.netWeight || 0), 0),
    totalEligible: data.reduce(
      (sum, row) => sum + Number(row.eligibleAmount || 0),
      0
    ),
    totalPartial: data.reduce((sum, row) => sum + Number(row.partial || 0), 0),
  };
}

export default function JewelDetails({ jewels = [], columns, onRelease }) {
  const totals = getTotals(jewels);

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Jewellery Details</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="border p-2 text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jewels.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) =>
                col.key !== "release" ? (
                  <td key={col.key} className="border p-2">
                    {row[col.key]}
                  </td>
                ) : (
                  <td key={col.key} className="border p-2">
                    <button
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                      onClick={() => onRelease(row)}
                    >
                      Release
                    </button>
                  </td>
                )
              )}
            </tr>
          ))}

          <tr className="bg-blue-100 font-semibold">
            <td className="border p-2">Totals</td>
            <td className="border p-2">{totals.totalUnits}</td>
            <td className="border p-2">{totals.totalGross}</td>
            <td className="border p-2">{totals.totalNet}</td>
            <td className="border p-2"></td>
            <td className="border p-2">{totals.totalEligible}</td>
            <td className="border p-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
