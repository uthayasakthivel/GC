// import { useState } from "react";

// export const useImageUploader = (maxImages = 4) => {
//   const [images, setImages] = useState([]);
//   const [previewUrls, setPreviewUrls] = useState([]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length + images.length > maxImages) {
//       alert(`You can upload up to ${maxImages} images only.`);
//       return;
//     }

//     const newFiles = files.slice(0, maxImages - images.length);
//     const newUrls = newFiles.map((file) => URL.createObjectURL(file));

//     setImages((prev) => [...prev, ...newFiles]);
//     setPreviewUrls((prev) => [...prev, ...newUrls]); // ✅ Needed for preview
//   };

//   const handleRemoveImage = (indexToRemove) => {
//     setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
//     setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
//   };

//   return {
//     images,
//     previewUrls,
//     handleImageChange,
//     handleRemoveImage,
//     resetImages: () => {
//       setImages([]);
//       setPreviewUrls([]);
//     },
//   };
// };

import { useState } from "react";

export const useImageUploader = (maxFiles = 4) => {
  // Initialize files and previewUrls as arrays of fixed length filled with null
  const [files, setFiles] = useState(Array(maxFiles).fill(null));
  const [previewUrls, setPreviewUrls] = useState(Array(maxFiles).fill(null));

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    console.log("File selected at index", index, file);
    if (!file) return;

    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = file;
      console.log("New files array:", newFiles);
      return newFiles;
    });

    setPreviewUrls((prevUrls) => {
      const newUrls = [...prevUrls];
      if (file.type.startsWith("image/")) {
        newUrls[index] = URL.createObjectURL(file);
      } else {
        newUrls[index] = null;
      }
      return newUrls;
    });
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = null;
      return newFiles;
    });

    setPreviewUrls((prevUrls) => {
      const newUrls = [...prevUrls];
      newUrls[index] = null;
      return newUrls;
    });
  };

  const resetFiles = () => {
    setFiles(Array(maxFiles).fill(null));
    setPreviewUrls(Array(maxFiles).fill(null));
  };

  return {
    files,
    previewUrls,
    handleFileChange,
    handleRemoveFile,
    resetFiles,
  };
};
