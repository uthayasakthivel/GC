// controllers/meltingSheetController.js
import MeltingSheet from "../models/MeltingSheet.js";
import { getNextMeltingSheetNumber } from "../utils/getNextMeltingSheetNumber.js";
import BuyingSheet from "../models/BuyingSheet.js";

// export const createMeltingSheet = async (req, res) => {
//   try {
//     const {
//       buyingSheetId,
//       meltingCenter,
//       meltingPlace,
//       meltingRefPerson,
//       grossWeight,
//       afterStone,
//       afterMelting,
//       kacchaPurity,
//       sellingRate,
//       totalAmountRecieved,
//       amountDisbursedMethod,
//       amountFromOnline,
//       amountFromOffline,
//       preparedBy,
//     } = req.body;

//     // Validate required fields
//     if (
//       !buyingSheetId ||
//       !meltingCenter ||
//       !meltingPlace ||
//       !meltingRefPerson ||
//       !grossWeight ||
//       !afterStone ||
//       !afterMelting ||
//       !kacchaPurity ||
//       !sellingRate ||
//       !totalAmountRecieved ||
//       !preparedBy
//     ) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Get next sheet number
//     const sheetNumber = await getNextMeltingSheetNumber();

//     // Fetch buying sheet for articleId and buying rate
//     const buyingSheet = await BuyingSheet.findById(buyingSheetId).lean();
//     if (!buyingSheet) {
//       return res.status(404).json({ message: "Buying sheet not found" });
//     }

//     const articleId = buyingSheet.articleId;
//     const buyingRate = buyingSheet.totalAmountSpend;

//     // Convert string inputs to numbers safely
//     const grossWeightNum = parseFloat(grossWeight);
//     const afterStoneNum = parseFloat(afterStone);
//     const afterMeltingNum = parseFloat(afterMelting);
//     const kacchaPurityNum = parseFloat(kacchaPurity);
//     const buyingRateNum = parseFloat(buyingRate) || 0;
//     const sellingRateNum = parseFloat(sellingRate);
//     const totalAmountRecievedNum = parseFloat(totalAmountRecieved);
//     const amountOnlineNum = parseFloat(amountFromOnline) || 0;
//     const amountOfflineNum = parseFloat(amountFromOffline) || 0;

//     // Calculate net profit
//     const netProfit = totalAmountRecievedNum - buyingSheet.netAmount; // Example formula

//     // Prepare nested objects according to schema
//     const goldDetails = {
//       grossWeight: grossWeightNum,
//       afterStone: afterStoneNum,
//       afterMelting: afterMeltingNum,
//       kacchaPurity: kacchaPurityNum,
//     };

//     const rateDetails = {
//       buyingRate: buyingRateNum,
//       sellingRate: sellingRateNum,
//       totalAmountRecieved: totalAmountRecievedNum,
//       amountDisbursedMethod,
//       amountFromOnline: amountOnlineNum,
//       amountFromOffline: amountOfflineNum,
//       netProfit,
//     };

//     const imagePaths =
//       req.files?.map((file) => {
//         return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
//       }) || [];

//     // Create new melting sheet
//     const meltingSheet = new MeltingSheet({
//       sheetNumber,
//       date: new Date(),
//       meltingCenter,
//       meltingPlace,
//       meltingRefPerson,
//       articleId,
//       buyingSheetId,
//       goldDetails,
//       rateDetails,
//       preparedBy,
//       createdBy: req.user.id, // from verifyToken
//       images: imagePaths,
//     });

//     const savedSheet = await meltingSheet.save();

//     res.status(201).json({
//       message: "Melting sheet created successfully",
//       sheet: savedSheet,
//     });
//   } catch (error) {
//     console.error("Melting sheet creation error:", error);
//     res.status(500).json({ message: "Failed to create melting sheet" });
//   }
// };

export const createMeltingSheet = async (req, res) => {
  try {
    const {
      buyingSheetId,
      meltingCenter,
      meltingPlace,
      meltingRefPerson,
      grossWeight,
      afterStone,
      afterMelting,
      kacchaPurity,
      sellingRate,
      totalAmountRecieved,
      amountDisbursedMethod,
      amountFromOnline,
      amountFromOffline,
      preparedBy,
    } = req.body;

    // Validate required fields
    if (
      !buyingSheetId ||
      !meltingCenter ||
      !meltingPlace ||
      !meltingRefPerson ||
      !grossWeight ||
      !afterStone ||
      !afterMelting ||
      !kacchaPurity ||
      !sellingRate ||
      !totalAmountRecieved ||
      !preparedBy
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get next sheet number
    const sheetNumber = await getNextMeltingSheetNumber();

    // Fetch buying sheet for reference data
    const buyingSheet = await BuyingSheet.findById(buyingSheetId)
      .populate("articleId")
      .lean();
    if (!buyingSheet) {
      return res.status(404).json({ message: "Buying sheet not found" });
    }

    const articleId = buyingSheet.articleId?._id;
    const buyingRate = buyingSheet.totalAmountSpend;
    const buyingNetAmount = buyingSheet.netAmount;

    // Convert inputs to numbers
    const grossWeightNum = parseFloat(grossWeight);
    const afterStoneNum = parseFloat(afterStone);
    const afterMeltingNum = parseFloat(afterMelting);
    const kacchaPurityNum = parseFloat(kacchaPurity);
    const buyingRateNum = parseFloat(buyingRate) || 0;
    const sellingRateNum = parseFloat(sellingRate);
    const totalAmountRecievedNum = parseFloat(totalAmountRecieved);
    const amountOnlineNum = parseFloat(amountFromOnline) || 0;
    const amountOfflineNum = parseFloat(amountFromOffline) || 0;

    // Calculate net profit
    const netProfit = totalAmountRecievedNum - buyingNetAmount;

    // Prepare nested objects according to schema
    const goldDetails = {
      grossWeight: grossWeightNum,
      afterStone: afterStoneNum,
      afterMelting: afterMeltingNum,
      kacchaPurity: kacchaPurityNum,
    };

    const rateDetails = {
      buyingRate: buyingRateNum,
      sellingRate: sellingRateNum,
      totalAmountRecieved: totalAmountRecievedNum,
      amountDisbursedMethod,
      amountFromOnline: amountOnlineNum,
      amountFromOffline: amountOfflineNum,
      netProfit,
    };

    const imagePaths =
      req.files?.map((file) => {
        return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
      }) || [];

    // Create new melting sheet with extra fields from buying sheet
    const meltingSheet = new MeltingSheet({
      sheetNumber,
      date: new Date(),
      meltingCenter,
      meltingPlace,
      meltingRefPerson,
      articleId,
      buyingSheetId, // still store the reference if needed
      buyingSheetNumber: buyingSheet.sheetNumber,
      buyingCustomerName: buyingSheet.customerName,
      buyingArticleName:
        buyingSheet.articleId?.jewelleryName || buyingSheet.articleName,
      buyingNetAmount,
      goldDetails,
      rateDetails,
      preparedBy,
      createdBy: req.user.id, // from verifyToken
      images: imagePaths,
    });

    const savedSheet = await meltingSheet.save();
    const populatedSheet = await MeltingSheet.findById(savedSheet._id)
      .populate("createdBy", "name") // populate with 'name' field from User
      .lean();
    // Delete the buying sheet after saving melting sheet
    await BuyingSheet.findByIdAndDelete(buyingSheetId);

    res.status(201).json({
      message: "Melting sheet created successfully",
      sheet: populatedSheet,
    });
  } catch (error) {
    console.error("Melting sheet creation error:", error);
    res.status(500).json({ message: "Failed to create melting sheet" });
  }
};

// ✅ Get all melting sheets (minimal fields)
export const getMeltingSheets = async (req, res) => {
  try {
    const sheets = await MeltingSheet.find()
      .sort({ createdAt: -1 })
      .select("sheetNumber date meltingCenter meltingPlace") // Only required fields
      .lean();

    res.json(sheets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch melting sheets" });
  }
};

// ✅ Get melting sheet by ID (with populated article name)
export const getMeltingSheetById = async (req, res) => {
  try {
    const { id } = req.params;

    const sheet = await MeltingSheet.findById(id)
      .populate("buyingSheetId", "sheetNumber") // Populating from BuyingSheet
      .lean();

    if (!sheet) return res.status(404).json({ message: "Not found" });

    res.json(sheet);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch melting sheet" });
  }
};

// ✅ Update melting sheet
export const updateMeltingSheet = async (req, res) => {
  try {
    const updated = await MeltingSheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update melting sheet" });
  }
};

// ✅ Delete by ID
export const deleteMeltingSheetById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSheet = await MeltingSheet.findByIdAndDelete(id);

    if (!deletedSheet) {
      return res.status(404).json({ message: "Melting sheet not found" });
    }

    res.json({
      message: "Melting sheet deleted successfully",
      deletedSheet,
    });
  } catch (error) {
    console.error("Error deleting melting sheet by ID:", error);
    res.status(500).json({ message: "Failed to delete melting sheet" });
  }
};

// ✅ Delete selected melting sheets
export const deleteSelectedMeltingSheets = async (req, res) => {
  try {
    const { ids } = req.body; // Expects: { ids: ["id1", "id2", ...] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const result = await MeltingSheet.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `${result.deletedCount} melting sheet(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting selected melting sheets:", error);
    res
      .status(500)
      .json({ message: "Failed to delete selected melting sheets" });
  }
};

// ✅ Delete all melting sheets
export const deleteAllMeltingSheets = async (req, res) => {
  try {
    const result = await MeltingSheet.deleteMany({});

    res.json({
      message: `${result.deletedCount} melting sheet(s) deleted successfully (all sheets)`,
    });
  } catch (error) {
    console.error("Error deleting all melting sheets:", error);
    res.status(500).json({ message: "Failed to delete all melting sheets" });
  }
};
