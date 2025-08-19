import mongoose from "mongoose";
import FinanceSheet from "../models/FinanceSheet.js";
import { getNextFinanceSheetNumber } from "../utils/getNextFinanceSheetNumber.js";

export const createFinanceSheet = async (req, res) => {
  try {
    const {
      branchId,
      customerName,
      phoneNumber,
      refPerson,
      amountpaid,
      interest,
      disbursedDate,
      recievedDate,
      preparedBy,
    } = req.body;

    const sheetNumber = await getNextSheetNumber("FinanceSheet");

    const branchObjectId = mongoose.Types.ObjectId.isValid(branchId)
      ? new mongoose.Types.ObjectId(branchId)
      : null;
    if (!branchObjectId) {
      return res.status(400).json({ message: "Invalid branchId" });
    }

    // Calculate noOfDays
    let noOfDays = 0;
    if (disbursedDate && recievedDate) {
      const start = new Date(disbursedDate);
      const end = new Date(recievedDate);
      noOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // diff in days
    }

    // Calculate totalInterest
    const totalInterest = parseFloat(interest || 0) * noOfDays;

    const financeSheet = new FinanceSheet({
      branchId: branchObjectId,
      sheetNumber,
      date: new Date(),
      customerName,
      phoneNumber,
      refPerson,
      amountpaid: parseFloat(amountpaid) || 0,
      interest: parseFloat(interest) || 0,
      disbursedDate: disbursedDate ? new Date(disbursedDate) : null,
      recievedDate: recievedDate ? new Date(recievedDate) : null,
      noOfDays,
      totalInterest,
      recievedAmount: 0, // Read-only field, default 0
      preparedBy,
      createdBy: req.user.id,
    });

    const savedSheet = await financeSheet.save();
    const populatedSheet = await FinanceSheet.findById(savedSheet._id)
      .populate("createdBy", "name email")
      .populate("branchId", "name")
      .lean();

    res.status(201).json({
      message: "Finance sheet created successfully",
      sheet: populatedSheet,
    });
  } catch (error) {
    console.error("Finance sheet creation error:", error);
    res.status(500).json({ message: "Failed to create finance sheet" });
  }
};
