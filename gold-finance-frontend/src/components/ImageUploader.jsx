const ImageUploader = ({ previewUrls, onImageChange, onRemoveImage }) => {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Upload Images (Max 4):</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onImageChange}
        className="w-full border p-2"
      />

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-3">
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
