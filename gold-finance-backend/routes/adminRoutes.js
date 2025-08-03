// auth-backend/routes/adminRoutes.js
import express from "express";
import { listUsers, approveUser } from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/users", verifyToken, isAdmin, listUsers); // ?role=employee
router.patch("/approve/:userId", verifyToken, isAdmin, approveUser);

export default router;
