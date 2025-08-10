import express from "express";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import {
  createSellingSheet,
  getSellingSheets,
  getSellingSheetById,
  updateSellingSheet,
  deleteSellingSheetById,
  deleteSelectedSellingSheets,
  deleteAllSellingSheets,
} from "../controllers/sellingSheetController.js";
import { getNextSellingSheetNumber } from "../utils/getNextSellingSheetNumber.js";
const router = express.Router();

// Get next sheet number
router.get("/selling-sheet/next-number", async (req, res) => {
  try {
    const next = await getNextSellingSheetNumber();
    res.json({ next });
  } catch (err) {
    res.status(500).json({ message: "Failed to get next sheet number" });
  }
});

// Create selling sheet
router.post("/selling-sheet", verifyToken, isAdmin, createSellingSheet);

// Get all selling sheets
router.get("/selling-sheet", verifyToken, isAdmin, getSellingSheets);

// Get single selling sheet by ID
router.get("/selling-sheet/:id", verifyToken, isAdmin, getSellingSheetById);

// Update selling sheet
router.put("/selling-sheet/:id", verifyToken, isAdmin, updateSellingSheet);

// Delete selling sheet
router.delete(
  "/selling-sheet/:id",
  verifyToken,
  isAdmin,
  deleteSellingSheetById
);
router.post(
  "/selling-sheet/delete-selected",
  verifyToken,
  isAdmin,
  deleteSelectedSellingSheets
);
router.delete("/selling-sheet", verifyToken, isAdmin, deleteAllSellingSheets);

export default router;
