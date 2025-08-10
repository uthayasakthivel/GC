import mongoose from "mongoose";

const buyingSheetSchema = new mongoose.Schema({
  sheetNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  customerName: String,
  phoneNumber: String,
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jewellery", // ✅ Matches the model name exactly
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  goldDetails: {
    grossWeight: Number,
    stoneWeight: Number,
    netWeight: Number,
    purity: Number,
    is916HM: Boolean,
  },
  buyingRate: Number,
  netAmount: Number,
  amountDisbursedMethod: String, // "cash", "account", or "both"
  amountFromOnline: Number,
  amountFromOffline: Number,
  commission: {
    name: String,
    phone: String,
    fixed: Number,
  },
  miscellaneousAmount: Number,
  totalAmountSpend: Number,
  preparedBy: String,
  createdBy: String, // user ID
  images: [String], // array of image file paths
});

export default mongoose.model("BuyingSheet", buyingSheetSchema);
