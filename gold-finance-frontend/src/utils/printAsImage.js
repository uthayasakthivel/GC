// src/utils/printAsImage.js
import html2canvas from "html2canvas";

export async function printAsImage(element) {
  if (!element) return;

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
            margin: 0; 
            padding: 0; 
            text-align: center;
            background: white;
          }
          img {
            max-width: 100%;
            height: auto;
            object-fit: contain;
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 5px;
            border: none !important;
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
}
