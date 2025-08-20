import express from "express";
import { getNextLoanIdApi } from "../controllers/loanController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get next Loan ID
router.get("/next-id", verifyToken, getNextLoanIdApi);

export default router;
