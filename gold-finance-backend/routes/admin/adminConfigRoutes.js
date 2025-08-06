// routes/adminConfigRoutes.js
import express from "express";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  getTodayRates,
  setTodayRates,
  getBuyingRates,
  setBuyingRates,
  getOpeningBalance,
  addToOpeningBalance,
  getClosingBalance,
  getJewelleryList,
  getJewelleryById,
  updateJewellery,
  deleteJewellery,
  createJewellery,
} from "../../controllers/adminConfigController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Branch routes
router.get("/branches", verifyToken, getBranches);
router.post("/branches", verifyToken, isAdmin, createBranch);
router.put("/branches/:id", verifyToken, isAdmin, updateBranch);
router.delete("/branches/:id", verifyToken, isAdmin, deleteBranch);

// Today rates
router.get("/rates/today", verifyToken, getTodayRates);
router.post("/rates/today", verifyToken, isAdmin, setTodayRates);

// Buying rates
router.get("/rates/buying", verifyToken, getBuyingRates);
router.post("/rates/buying", verifyToken, isAdmin, setBuyingRates);

// Opening balance
router.get("/opening-balance", verifyToken, getOpeningBalance);
router.get("/closing-balance", verifyToken, getClosingBalance);
router.post("/opening-balance/add", verifyToken, isAdmin, addToOpeningBalance);

// Create Jewellery Type
router.post("/jewellery/add", verifyToken, isAdmin, createJewellery);

// Get All Jewellery Types
router.get("/jewellery", verifyToken, getJewelleryList);

// Get Single Jewellery
router.get("/jewellery/:id", verifyToken, getJewelleryById);

// Update Jewellery Name
router.put("/jewellery/:id", verifyToken, isAdmin, updateJewellery);

// Delete Jewellery Type
router.delete("/jewellery/:id", verifyToken, isAdmin, deleteJewellery);

export default router;
