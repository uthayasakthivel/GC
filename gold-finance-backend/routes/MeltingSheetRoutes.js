import express from "express";
import {
  isAdmin,
  isManager,
  verifyToken,
} from "../middlewares/authMiddleware.js";
import {
  createMeltingSheet,
  deleteAllMeltingSheets,
  deleteMeltingSheetById,
  deleteSelectedMeltingSheets,
  getMeltingSheetById,
  getMeltingSheets,
  updateMeltingSheet,
} from "../controllers/meltingSheetController.js";
import { getNextMeltingSheetNumber } from "../utils/getNextMeltingSheetNumber.js";
import { upload } from "../middlewares/upload.js";
const router = express.Router();

// Get next sheet number (Manager+)
router.get(
  "/melting-sheet/next-number",
  verifyToken,
  isManager,
  async (req, res) => {
    try {
      const next = await getNextMeltingSheetNumber();
      res.json({ next });
    } catch (err) {
      res.status(500).json({ message: "Failed to get next sheet number" });
    }
  }
);

// Create melting sheet (Manager+)
router.post(
  "/melting-sheet",
  verifyToken,

  upload.array("images", 2),
  (req, res, next) => {
    console.log("Files received:", req.files);
    next();
  },
  isManager,
  createMeltingSheet
);

// List all melting sheets (Admin only)
router.get("/melting-sheet", verifyToken, isAdmin, getMeltingSheets);

// Get single sheet (Admin only)
router.get("/melting-sheet/:id", verifyToken, isAdmin, getMeltingSheetById);

// Update sheet (Admin only)
router.put("/melting-sheet/:id", verifyToken, isAdmin, updateMeltingSheet);

// Delete single sheet (Admin only)
router.delete(
  "/melting-sheet/:id",
  verifyToken,
  isAdmin,
  deleteMeltingSheetById
);

// Delete selected sheets (Admin only)
router.post(
  "/melting-sheet/delete-selected",
  verifyToken,
  isAdmin,
  deleteSelectedMeltingSheets
);

// Delete all sheets (Admin only)
router.delete("/melting-sheet", verifyToken, isAdmin, deleteAllMeltingSheets);

export default router;
