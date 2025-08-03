// routes/authRoutes.js or similar
import express from "express";
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google-login", googleLogin);

export default router;
