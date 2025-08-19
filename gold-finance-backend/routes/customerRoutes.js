// routes/customerRoutes.js
import express from "express";
import Customer from "../models/Customer.js";
import { registerCustomer } from "../controllers/customerController.js";
import { sendOTP, verifyOTP } from "../controllers/otpController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateRegistration } from "../middlewares/validateRegistration.js";
import { otpVerified } from "../middlewares/otpVerified.js";
import { getNextCustomerIdApi } from "../controllers/adminConfigController.js";
const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post(
  "/register",
  verifyToken,
  validateRegistration,
  // otpVerified,
  registerCustomer
);
router.get("/next-id", verifyToken, getNextCustomerIdApi);

export default router;
