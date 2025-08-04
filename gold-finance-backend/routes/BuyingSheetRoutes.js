// routes/adminConfigRoutes.js
import express from "express";
import { createBuyingSheet } from "../controllers/buyingSheetController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import { getNextSheetNumber } from "../utils/getNextSheetNumber.js";

const router = express.Router();

// createBuyingSheet routes
router.post(
  "/buying-sheet",
  verifyToken,
  upload.array("images", 4),
  createBuyingSheet
);

router.get("/buying-sheet/next-number", async (req, res) => {
  try {
    const next = await getNextSheetNumber();
    res.json({ next });
  } catch (err) {
    res.status(500).json({ message: "Failed to get next sheet number" });
  }
});
export default router;
