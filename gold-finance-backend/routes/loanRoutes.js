import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import loanUpload from "../middlewares/loanUpload.js";
import {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  getLatestLoans,
  getNextLoanIdApi,
  payInterest,
} from "../controllers/loanController.js";

const router = express.Router();
router.get("/next-id", verifyToken, getNextLoanIdApi);
router.get("/latest", verifyToken, getLatestLoans);
router.get("/", verifyToken, getAllLoans);
router.get("/:id", verifyToken, getLoanById);
router.patch("/:id/pay-interest", payInterest);

router.post(
  "/create-loan",
  verifyToken,
  loanUpload.fields([
    { name: "customerPhoto", maxCount: 1 },
    { name: "jewelPhoto", maxCount: 1 },
    { name: "aadharPhoto", maxCount: 1 },
    { name: "declarationPhoto", maxCount: 1 },
    { name: "otherPhoto", maxCount: 1 },
  ]),
  createLoan
);

router.put(
  "/:id",
  verifyToken,
  loanUpload.fields([
    { name: "customerPhoto", maxCount: 1 },
    { name: "jewelPhoto", maxCount: 1 },
    { name: "aadharPhoto", maxCount: 1 },
    { name: "declarationPhoto", maxCount: 1 },
    { name: "otherPhoto", maxCount: 1 },
  ]),
  updateLoan
);

router.delete("/:id", verifyToken, deleteLoan);
export default router;
