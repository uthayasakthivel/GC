import mongoose from "mongoose";

const buyingSheetSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  sheetNumber: String, // ✅ This line is fine if the one above has a comma
  date: Date,
  customerName: String,
  phoneNumber: String,
  goldDetails: {
    grossWeight: Number,
    stoneWeight: Number,
    netWeight: Number,
    purity: Number,
    is916HM: Boolean,
  },
  buyingRate: Number,
  netAmount: Number,
  amountDisbursed: String, // "cash", "account", or "both"
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
