import { useState } from "react";

export const useImageUploader = (maxImages = 4) => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > maxImages) {
      alert(`You can upload up to ${maxImages} images only.`);
      return;
    }

    const newFiles = files.slice(0, maxImages - images.length);
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newUrls]); // ✅ Needed for preview
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return {
    images,
    previewUrls,
    handleImageChange,
    handleRemoveImage,
    resetImages: () => {
      setImages([]);
      setPreviewUrls([]);
    },
  };
};
