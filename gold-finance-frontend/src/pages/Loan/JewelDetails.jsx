const jewelData = [
  {
    ornament: "Rings",
    numItems: 1,
    grossWeight: 10.7,
    netWeight: 10,
    ratePerGram: 7000,
    eligibleAmount: 70000,
    partial: 67000,
  },
  {
    ornament: "bangle",
    numItems: 2,
    grossWeight: 24,
    netWeight: 20,
    ratePerGram: 7000,
    eligibleAmount: 140000,
    partial: 134000,
  },
  {
    ornament: "Chain",
    numItems: 1,
    grossWeight: 18,
    netWeight: 15,
    ratePerGram: 7000,
    eligibleAmount: 105000,
    partial: 100000,
  },
];

const columns = [
  { key: "ornament", label: "Ornament" },
  { key: "numItems", label: "No. of Items" },
  { key: "grossWeight", label: "Gross Weight" },
  { key: "netWeight", label: "Net Weight" },
  { key: "ratePerGram", label: "Rate/Gram" },
  { key: "eligibleAmount", label: "Eligible Amount" },
  { key: "partial", label: "Partial Amount" },
];

function getTotals(data) {
  return {
    totalUnits: data.reduce((sum, row) => sum + Number(row.numItems || 0), 0),
    totalGross: data.reduce(
      (sum, row) => sum + Number(row.grossWeight || 0),
      0
    ),
    totalNet: data.reduce((sum, row) => sum + Number(row.netWeight || 0), 0),
  };
}

export default function JewelDetails() {
  const totals = getTotals(jewelData);

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
          {jewelData.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key} className="border p-2">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {/* Totals row */}
          <tr className="bg-blue-100 font-semibold">
            <td className="border p-2">Totals</td>
            <td className="border p-2">{totals.totalUnits}</td>
            <td className="border p-2">{totals.totalGross}</td>
            <td className="border p-2">{totals.totalNet}</td>
            <td className="border p-2"></td>
            <td className="border p-2"></td>
            <td className="border p-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
