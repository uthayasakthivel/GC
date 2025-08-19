import mongoose from "mongoose";
import SellingSheet from "../models/SellingSheet.js";
import { getNextSellingSheetNumber } from "../utils/getNextSellingSheetNumber.js";
import { updateClosingBalanceAfterSelling } from "./adminConfigController.js";
import BuyingSheet from "../models/BuyingSheet.js";

export const createSellingSheet = async (req, res) => {
  try {
    const {
      buyingSheetId,
      sellingRate,
      valueAdded,
      amountDisbursedMethod,
      amountFromOnline,
      amountFromOffline,
      netAmount,
      buyerName,
      phoneNumber,
      address,
      preparedBy,
    } = req.body;

    // Validate required fields
    if (
      !buyingSheetId ||
      !sellingRate ||
      !valueAdded ||
      !amountDisbursedMethod ||
      !preparedBy ||
      !buyerName
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get next sheet number
    const sheetNumber = await getNextSellingSheetNumber();

    // Fetch buying sheet for gold data and buying amount
    const buyingSheet = await BuyingSheet.findById(buyingSheetId).lean();
    if (!buyingSheet) {
      return res.status(404).json({ message: "Buying sheet not found" });
    }

    const grossWeight = buyingSheet.goldDetails.grossWeight;
    const buyingAmount = buyingSheet.netAmount;
    const articleId = buyingSheet.articleId;

    // Convert string inputs to numbers safely
    const sellingRateNum = parseFloat(sellingRate);
    const valueAddedNum = parseFloat(valueAdded);
    const amountOnlineNum = parseFloat(amountFromOnline) || 0;
    const amountOfflineNum = parseFloat(amountFromOffline) || 0;
    const netAmountNum = parseFloat(netAmount);

    // Calculate selling amount & profit
    const grossAmount = grossWeight * sellingRateNum + valueAddedNum;
    const paymentTotalAmount = amountOnlineNum + amountOfflineNum;
    const netProfit = grossAmount - buyingAmount;

    // Prepare goldDetails object according to schema
    const goldDetails = {
      grossWeight, // required
      sellingRate: sellingRateNum, // required
      valueAdded: valueAddedNum, // required
      netAmount: netAmountNum,
      grossAmount, // required
      paymentTotalAmount, // required
      sellingAmount: grossAmount, // required, you had grossAmount here
      netProfit, // required
    };

    // Create new SellingSheet document matching your schema fields
    const sellingSheet = new SellingSheet({
      sheetNumber,
      date: new Date(),
      buyingSheetId,
      buyingSheetNumber: buyingSheet.sheetNumber,
      buyingCustomerName: buyingSheet.customerName,
      articleId,
      netAmount,
      customerName: buyerName,
      phoneNumber,
      address,
      buyingRate: buyingAmount, // you had this in schema but missing here, add if available
      amountDisbursedMethod,
      amountFromOnline: amountOnlineNum,
      amountFromOffline: amountOfflineNum,
      goldDetails, // nested object
      preparedBy,
      createdBy: req.user.id,
    });

    // Save to DB
    const savedSheet = await sellingSheet.save();
    const populatedSheet = await SellingSheet.findById(savedSheet._id)
      .populate("createdBy", "name") // populate with 'name' field from User
      .lean();
    // Update closing balance (assuming your function handles this)
    // const closingBalance = await updateClosingBalanceAfterSelling(
    //   paymentTotalAmount,
    //   grossWeight
    // );

    // Delete the buying sheet after saving melting sheet
    // await BuyingSheet.findByIdAndDelete(buyingSheetId);
    console.log("Reached update!");
    const updated = await BuyingSheet.findByIdAndUpdate(buyingSheetId, {
      sold: true,
    });
    console.log("Buying sheet marked as sold:", updated);
    res.status(201).json({
      message: "Selling sheet created successfully",
      sheet: populatedSheet,
      // closingBalance,
    });
  } catch (error) {
    console.error("Selling sheet creation error:", error);
    res.status(500).json({ message: "Failed to create selling sheet" });
  }
};

// export const createSellingSheet = async (req, res) => {
//   try {
//     const {
//       buyingSheetId,
//       sellingRate,
//       valueAdded,
//       amountDisbursedMethod,
//       amountFromOnline,
//       amountFromOffline,
//       netAmount,
//       buyerName,
//       phoneNumber,
//       address,
//       preparedBy,
//     } = req.body;

//     const sheetNumber = await getNextSellingSheetNumber();

//     // Get buying sheet to fetch gold data & buying amount
//     const buyingSheet = await BuyingSheet.findById(buyingSheetId).lean();
//     if (!buyingSheet) {
//       return res.status(404).json({ message: "Buying sheet not found" });
//     }

//     const grossWeight = buyingSheet.goldDetails.grossWeight;
//     const buyingAmount = buyingSheet.netAmount;
//     const articleId = buyingSheet.articleId;

//     // Calculate selling amount & profit
//     const sellingAmount =
//       parseFloat(grossWeight) * parseFloat(sellingRate) +
//       parseFloat(valueAdded);
//     const netProfit = sellingAmount - buyingAmount;

//     const paymentTotalAmount =
//       parseFloat(amountFromOnline || 0) + parseFloat(amountFromOffline || 0);

//     const sellingDetails = {
//       grossWeight,
//       sellingRate: parseFloat(sellingRate),
//       valueAdded: parseFloat(valueAdded),
//       articleId,
//       grossAmount: sellingAmount,
//       paymentMode: amountDisbursedMethod, // <-- match schema field
//       paymentOnlineAmount: parseFloat(amountFromOnline),
//       paymentOfflineAmount: parseFloat(amountFromOffline),
//       paymentTotalAmount,
//       buyingAmount,
//       sellingAmount,
//       netProfit,
//     };

//     const sellingSheet = new SellingSheet({
//       sheetNumber,
//       date: new Date(),
//       buyingSheetId,
//       articleId,
//       buyer: {
//         name: buyerName,
//         phone: phoneNumber,
//         address,
//       },
//       sellingDetails, // ✅ Pass entire object here
//       netAmount,
//       preparedBy,
//       createdBy: req.user.id,
//     });

//     const savedSheet = await sellingSheet.save();

//     const closingBalance = await updateClosingBalanceAfterSelling(
//       paymentTotalAmount,
//       grossWeight
//     );

//     res.status(201).json({
//       message: "Selling sheet created successfully",
//       sheet: savedSheet,
//       closingBalance,
//     });
//   } catch (error) {
//     console.error("Selling sheet creation error:", error);
//     res.status(500).json({ message: "Failed to create selling sheet" });
//   }
// };

// Get all

export const getSellingSheets = async (req, res) => {
  try {
    const sheets = await SellingSheet.find()
      .sort({ createdAt: -1 })
      .select("sheetNumber date customerName netAmount") // select only needed fields
      .lean();

    res.json(sheets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch selling sheets" });
  }
};

// Get by ID
export const getSellingSheetById = async (req, res) => {
  try {
    const { id } = req.params;

    const sheet = await SellingSheet.findById(id)
      .populate("articleId", "jewelleryName") // ✅ ADD THIS
      .lean();

    if (!sheet) return res.status(404).json({ message: "Not found" });

    res.json(sheet);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch selling sheet" });
  }
};

// Update
export const updateSellingSheet = async (req, res) => {
  try {
    const updated = await SellingSheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update selling sheet" });
  }
};

export const deleteSellingSheetById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSheet = await SellingSheet.findByIdAndDelete(id);

    if (!deletedSheet) {
      return res.status(404).json({ message: "Selling sheet not found" });
    }

    res.json({ message: "Selling sheet deleted successfully", deletedSheet });
  } catch (error) {
    console.error("Error deleting sheet by ID:", error);
    res.status(500).json({ message: "Failed to delete Selling sheet" });
  }
};

export const deleteSelectedSellingSheets = async (req, res) => {
  try {
    const { ids } = req.body; // Expects: { ids: ["id1", "id2", ...] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const result = await SellingSheet.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `${result.deletedCount} sheet(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting selected sheets:", error);
    res.status(500).json({ message: "Failed to delete selected sheets" });
  }
};

export const deleteAllSellingSheets = async (req, res) => {
  try {
    const result = await SellingSheet.deleteMany({});

    res.json({
      message: `${result.deletedCount} sheet(s) deleted successfully (all sheets)`,
    });
  } catch (error) {
    console.error("Error deleting all sheets:", error);
    res.status(500).json({ message: "Failed to delete all buying sheets" });
  }
};
