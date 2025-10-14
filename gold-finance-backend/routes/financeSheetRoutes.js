import { createFinanceSheet } from "../controllers/financeSheetController.js";
import {
  isAdmin,
  isManager,
  verifyToken,
} from "../middlewares/authMiddleware.js";
import express from "express";
import { getNextFinanceSheetNumber } from "../utils/getNextFinanceSheetNumber.js";

const router = express.Router();

// Get next sheet number (Manager+)
router.get(
  "/finance-sheet/next-number",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const next = await getNextFinanceSheetNumber();
      res.json({ next });
    } catch (err) {
      res.status(500).json({ message: "Failed to get next sheet number" });
    }
  }
);

// createFinanceSheet routes
router.post(
  "/finance-sheet",
  verifyToken,
  //   upload.array("images", 4),
  createFinanceSheet
);

export default router;
