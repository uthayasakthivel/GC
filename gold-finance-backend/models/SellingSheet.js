import mongoose from "mongoose";

const sellingSheetSchema = new mongoose.Schema({
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
  address: String,
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jewellery",
    required: true,
  },
  buyingSheetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BuyingSheet",
    required: true,
  },
  buyingRate: Number,
  amountDisbursedMethod: String, // "cash", "account", or "both"
  amountFromOnline: Number,
  amountFromOffline: Number,
  goldDetails: {
    grossWeight: { type: Number, required: true },
    sellingRate: { type: Number, required: true },
    valueAdded: { type: Number, required: true },
    netAmount: Number,
    grossAmount: { type: Number, required: true },
    paymentTotalAmount: { type: Number, required: true },
    sellingAmount: { type: Number, required: true },
    netProfit: { type: Number, required: true },
  },
  preparedBy: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("SellingSheet", sellingSheetSchema);
