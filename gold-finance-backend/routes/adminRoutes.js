// auth-backend/routes/adminRoutes.js
import express from "express";
import {
  listUsers,
  approveUser,
  deleteUser,
} from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/users", verifyToken, isAdmin, listUsers); // ?role=employee
router.put("/approve/:userId", verifyToken, isAdmin, approveUser);
router.delete("/delete/:userId", verifyToken, isAdmin, deleteUser);
export default router;
