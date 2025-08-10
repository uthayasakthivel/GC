// src/pages/sheets/SellingSheetPreview.jsx
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import useSheetDetails from "../../hooks/useSheetDetails";
import useDownloadPDF from "../../hooks/useDownloadPDF";
import { usePrintSheet } from "../../hooks/usePrintSheet";
import SheetPreview from "../../components/SheetPreview";

export default function SellingSheetPreview({ sheetType }) {
  const { id } = useParams();
  const printRef = useRef();
  const { sheet, loading } = useSheetDetails("selling", id);
  const { handlePrint } = usePrintSheet(printRef);
  const { handleDownloadPDF } = useDownloadPDF(
    printRef,
    sheet ? `SellingSheet-${sheet.sheetNumber}.pdf` : "sheet.pdf"
  );

  if (loading) return <div className="p-4">Loading...</div>;
  if (!sheet) return <div className="p-4 text-red-600">Sheet not found</div>;

  return (
    <DashboardLayout role="admin">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sheet #{sheet.sheetNumber}</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Print
            </button>
          </div>
        </div>

        <div ref={printRef}>
          <SheetPreview sheet={sheet} sheetType={sheetType} />
        </div>
      </div>
    </DashboardLayout>
  );
}
