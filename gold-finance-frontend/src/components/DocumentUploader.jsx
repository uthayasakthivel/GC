import { useState } from "react";

const DynamicUploader = ({ sheetType, onFilesChange }) => {
  const [files, setFiles] = useState([]);

  // Define labels for each sheet type
  const labelsMap = {
    buying: [
      "Article Picture with weight",
      "Aadhar",
      "Bank Pledge Sheet",
      "Self Declaration Form",
    ],
    melting: [
      "Article weight photo after stone and dirt removal",
      "Purity Buying Sheet",
    ],
  };

  const labels = labelsMap[sheetType] || [];

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = null;
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const getPreview = (file) => {
    if (!file) return null;
    if (file.type === "application/pdf") {
      return (
        <embed
          src={URL.createObjectURL(file)}
          type="application/pdf"
          className="w-full h-40 border rounded"
        />
      );
    }
    return (
      <img
        src={URL.createObjectURL(file)}
        alt="Preview"
        className="w-full h-40 object-cover border rounded"
      />
    );
  };

  return (
    <div className="space-y-4">
      {labels.map((label, index) => (
        <div key={index} className="mb-4">
          <label className="block font-medium mb-1">{label}:</label>

          {/* File Input */}
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange(e, index)}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {/* Preview */}
          {files[index] && (
            <div className="mt-2 relative">
              {getPreview(files[index])}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicUploader;
