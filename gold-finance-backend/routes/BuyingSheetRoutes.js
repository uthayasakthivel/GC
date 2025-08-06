// routes/adminConfigRoutes.js
import express from "express";
import {
  createBuyingSheet,
  getAllBuyingSheets,
  getBuyingSheetById,
} from "../controllers/buyingSheetController.js";

import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import { getNextSheetNumber } from "../utils/getNextSheetNumber.js";

const router = express.Router();
router.get("/buying-sheet/next-number", async (req, res) => {
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

export default router;
