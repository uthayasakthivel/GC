import mongoose from "mongoose";
import BuyingSheet from "../models/BuyingSheet.js";
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
    res.status(201).json(savedSheet);
  } catch (error) {
    console.error("Buying sheet creation error:", error);
    res.status(500).json({ message: "Failed to create buying sheet" });
  }
};
