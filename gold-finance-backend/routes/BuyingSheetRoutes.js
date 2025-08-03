// routes/adminConfigRoutes.js
import express from "express";
import { createBuyingSheet } from "../controllers/buyingSheetController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// createBuyingSheet routes
router.post("/buying-sheet", verifyToken, createBuyingSheet);
export default router;
