import multer from "multer";
import path from "path";

// Storage for loan images
const loanStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/loan-images/"); // Separate folder for loan images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const loanUpload = multer({ storage: loanStorage });

export default loanUpload;
