// routes/adminConfigRoutes.js
import express from "express";
import {
  createBuyingSheet,
  getAllBuyingSheets,
  getBuyingSheetById,
  deleteAllBuyingSheets,
  deleteBuyingSheetById,
  deleteSelectedBuyingSheets,
} from "../controllers/buyingSheetController.js";

import {
  isAdmin,
  isManager,
  verifyToken,
} from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import { getNextSheetNumber } from "../utils/getNextSheetNumber.js";

const router = express.Router();
router.get("/buying-sheet/next-number", verifyToken, async (req, res) => {
  try {
    const next = await getNextSheetNumber();
    res.json({ next });
  } catch (err) {
    res.status(500).json({ message: "Failed to get next sheet number" });
  }
});
// createBuyingSheet routes
router.post(
  "/buying-sheet",
  verifyToken,
  upload.array("images", 4),
  createBuyingSheet
);

router.get("/buying-sheet", verifyToken, isAdmin, getAllBuyingSheets);
router.get("/buying-sheet/:id", verifyToken, isAdmin, getBuyingSheetById);
router.delete("/buying-sheet/:id", verifyToken, isAdmin, deleteBuyingSheetById);
router.post(
  "/buying-sheet/delete-selected",
  verifyToken,
  isAdmin,
  deleteSelectedBuyingSheets
);
router.delete("/buying-sheet", verifyToken, isAdmin, deleteAllBuyingSheets);
export default router;
