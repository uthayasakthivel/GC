import { useCallback } from "react";
import html2canvas from "html2canvas";

export function usePrintSheet(printRef) {
  const handlePrint = useCallback(async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups for print preview");
        return;
      }

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

      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error("Failed to print:", error);
    }
  }, [printRef]);

  return { handlePrint };
}
