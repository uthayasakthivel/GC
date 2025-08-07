const ImageUploader = ({ previewUrls, onImageChange, onRemoveImage }) => {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Upload Images (Max 4):</label>

      {/* Browse & Camera Buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Browse */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onImageChange}
          disabled={previewUrls.length >= 4}
          className="hidden"
          id="browse-files"
        />
        <label
          htmlFor="browse-files"
          className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded ${
            previewUrls.length >= 4 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          📁 Browse Files
        </label>

        {/* Camera */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onImageChange}
          disabled={previewUrls.length >= 4}
          className="hidden"
          id="camera-capture"
        />
        <label
          htmlFor="camera-capture"
          className={`cursor-pointer bg-green-600 text-white px-4 py-2 rounded ${
            previewUrls.length >= 4 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          📷 From Camera
        </label>
      </div>

      {/* Preview + Delete */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-40 object-cover border rounded"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
