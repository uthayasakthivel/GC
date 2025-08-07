import mongoose from "mongoose";
import BuyingSheet from "../models/BuyingSheet.js";
import { updateClosingBalance } from "./adminConfigController.js";
import { getNextSheetNumber } from "../utils/getNextSheetNumber.js";

export const createBuyingSheet = async (req, res) => {
  try {
    // Extract values from request body
    const {
      branchId,
      customerName,
      phoneNumber,
      grossWeight,
      stoneWeight,
      is916HM,
      purity,
      buyingRate,
      amountDisbursed,
      commissionPersonName,
      commissionPhone,
      commissionFixed,
      miscellaneousAmount,
      preparedBy,
    } = req.body;
    const sheetNumber = await getNextSheetNumber();

    // Convert to ObjectId if it's valid
    const branchObjectId = mongoose.Types.ObjectId.isValid(branchId)
      ? new mongoose.Types.ObjectId(branchId)
      : null;

    if (!branchObjectId) {
      return res.status(400).json({ message: "Invalid branchId" });
    }

    // Derived calculations
    const netWeight = parseFloat(grossWeight) - parseFloat(stoneWeight);
    const netAmount = parseFloat(buyingRate) * netWeight;
    const totalAmountSpend =
      netAmount +
      parseFloat(commissionFixed || 0) +
      parseFloat(miscellaneousAmount || 0);

    // Construct goldDetails object
    const goldDetails = {
      grossWeight: parseFloat(grossWeight),
      stoneWeight: parseFloat(stoneWeight),
      netWeight,
      purity: parseFloat(purity),
      is916HM: is916HM === "true" || is916HM === true, // accepts string "true"/"false" or boolean
    };

    const commissionDetails = {
      name: commissionPersonName,
      phone: commissionPhone,
      fixed: parseFloat(commissionFixed),
    };

    const imagePaths =
      req.files?.map((file) => {
        return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
      }) || [];

    const buyingSheet = new BuyingSheet({
      branchId,
      sheetNumber,
      date: new Date(), // today's date
      customerName,
      phoneNumber,
      goldDetails,
      buyingRate: parseFloat(buyingRate),
      netAmount,
      amountDisbursed,
      commission: commissionDetails,
      miscellaneousAmount: parseFloat(miscellaneousAmount),
      totalAmountSpend,
      preparedBy,
      createdBy: req.user.id,
      images: imagePaths,
    });

    const savedSheet = await buyingSheet.save();
    const closingBalance = await updateClosingBalance(
      totalAmountSpend,
      netWeight
    );

    res.status(201).json({
      message: "Sheet created successfully",
      sheet: savedSheet,
      closingBalance, // comes from updateClosingBalance()
    });
  } catch (error) {
    console.error("Buying sheet creation error:", error);
    res.status(500).json({ message: "Failed to create buying sheet" });
  }
};

export const getAllBuyingSheets = async (req, res) => {
  try {
    const sheets = await BuyingSheet.find()
      .sort({ date: -1 }) // recent first
      .select("sheetNumber customerName date totalAmountSpend"); // select only needed fields for list

    res.json(sheets);
  } catch (error) {
    console.error("Error fetching buying sheets:", error);
    res.status(500).json({ message: "Failed to fetch buying sheets" });
  }
};

export const getBuyingSheetById = async (req, res) => {
  try {
    const { id } = req.params;

    const sheet = await BuyingSheet.findById(id)
      .populate("branchId", "name location") // Optional: get branch details
      .lean();

    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }

    res.json(sheet);
  } catch (error) {
    console.error("Error fetching sheet by ID:", error);
    res.status(500).json({ message: "Failed to fetch sheet" });
  }
};

export const deleteBuyingSheetById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSheet = await BuyingSheet.findByIdAndDelete(id);

    if (!deletedSheet) {
      return res.status(404).json({ message: "Buying sheet not found" });
    }

    res.json({ message: "Buying sheet deleted successfully", deletedSheet });
  } catch (error) {
    console.error("Error deleting sheet by ID:", error);
    res.status(500).json({ message: "Failed to delete buying sheet" });
  }
};

export const deleteSelectedBuyingSheets = async (req, res) => {
  try {
    const { ids } = req.body; // Expects: { ids: ["id1", "id2", ...] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const result = await BuyingSheet.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `${result.deletedCount} sheet(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting selected sheets:", error);
    res.status(500).json({ message: "Failed to delete selected sheets" });
  }
};

export const deleteAllBuyingSheets = async (req, res) => {
  try {
    const result = await BuyingSheet.deleteMany({});

    res.json({
      message: `${result.deletedCount} sheet(s) deleted successfully (all sheets)`,
    });
  } catch (error) {
    console.error("Error deleting all sheets:", error);
    res.status(500).json({ message: "Failed to delete all buying sheets" });
  }
};
