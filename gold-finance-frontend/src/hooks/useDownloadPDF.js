import { useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function useDownloadPDF(ref, filename) {
  const handleDownloadPDF = useCallback(async () => {
    if (!ref.current) return;

    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  }, [ref, filename]);

  return { handleDownloadPDF };
}
