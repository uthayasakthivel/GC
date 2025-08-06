// src/pages/sheets/AdminSheetPreview.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosInstance";
import DashboardLayout from "../../components/pageLayouts/DashboardLayout";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AdminSheetPreview() {
  const { id } = useParams();
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  // Fetch buying sheet details on mount
  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await axios.get(`/sheet/buying-sheet/${id}`);
        setSheet(res.data);
      } catch (err) {
        console.error("Error fetching sheet:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSheet();
  }, [id]);

  // Download the content as a PDF using jsPDF + html2canvas
  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BuyingSheet-${sheet.sheetNumber}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  // Print the content by opening it in a new window as an image
  const handlePrint = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const printWindow = window.open("", "_blank");
      if (!printWindow) return alert("Please allow popups for print preview");

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Preview</title>
            <style>
              body, html {
                margin: 0; padding: 0; text-align: center;
              }
              img {
                max-width: 100%; height: auto;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      // Wait for image to load before printing
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error("Failed to print:", error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!sheet) return <div className="p-4 text-red-600">Sheet not found</div>;

  return (
    <DashboardLayout role="admin">
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .printable-content {
              max-width: 100%;
              font-size: 12pt;
              line-height: 1.2;
            }
            .printable-content img {
              max-width: 100%;
              height: 100px !important;
              object-fit: contain;
              page-break-inside: avoid;
              break-inside: avoid;
              margin-bottom: 5px;
            }
            .printable-content div, 
            .printable-content ul, 
            .printable-content p {
              page-break-inside: avoid;
            }
          }
        `}
      </style>

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

        {/* Printable content container */}
        <div
          ref={printRef}
          className="printable-content bg-white p-4 border rounded space-y-4 max-w-3xl mx-auto"
        >
          <div>
            <p>
              <strong>Name:</strong> {sheet.customerName}
            </p>
            <p>
              <strong>Date:</strong> {new Date(sheet.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Branch:</strong> {sheet.branchId?.name} -{" "}
              {sheet.branchId?.location}
            </p>
          </div>

          <div>
            <h3 className="font-bold">Gold Details</h3>
            <ul className="list-disc ml-4 space-y-1">
              <li>
                <strong>Gross Weight:</strong> {sheet.goldDetails?.grossWeight}{" "}
                g
              </li>
              <li>
                <strong>Stone Weight:</strong> {sheet.goldDetails?.stoneWeight}{" "}
                g
              </li>
              <li>
                <strong>Net Weight:</strong> {sheet.goldDetails?.netWeight} g
              </li>
              <li>
                <strong>Purity:</strong> {sheet.goldDetails?.purity}%
              </li>
              <li>
                <strong>Rate:</strong> ₹{sheet.buyingRate}
              </li>
              <li>
                <strong>Net Amount:</strong> ₹{sheet.netAmount}
              </li>
              <li>
                <strong>Commission Person Name:</strong>{" "}
                {sheet.commission?.name}
              </li>
              <li>
                <strong>Commission Person Contact:</strong>{" "}
                {sheet.commission?.phone}
              </li>
              <li>
                <strong>Commission Amount:</strong> ₹{sheet.commission?.fixed}
              </li>
              <li>
                <strong>Miscellaneous:</strong> ₹{sheet.miscellaneousAmount}
              </li>
              <li>
                <strong>Total Spend:</strong> ₹{sheet.totalAmountSpend}
              </li>
            </ul>
          </div>

          {sheet.images && sheet.images.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Uploaded Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sheet.images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Uploaded ${idx + 1}`}
                    className="w-full h-40 object-cover border"
                    crossOrigin="anonymous"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
