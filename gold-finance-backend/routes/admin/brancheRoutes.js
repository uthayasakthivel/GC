import express from "express";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../../controllers/branchController.js";
import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getBranches);
router.post("/", verifyToken, isAdmin, createBranch);
router.put("/:id", verifyToken, isAdmin, updateBranch);
router.delete("/:id", verifyToken, isAdmin, deleteBranch);

export default router;
