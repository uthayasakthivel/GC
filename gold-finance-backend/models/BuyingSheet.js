import mongoose from "mongoose";

const BuyingSheetSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    date: { type: Date, default: Date.now },

    goldDetails: {
      grossWeight: Number,
      purity: Number, // karats or percentage
      netWeight: Number,
    },

    buyingRate: Number, // per gram or per unit
    commission: Number, // as amount or percentage
    deductions: Number, // any other deductions

    netAmount: Number, // calculated field (netWeight * buyingRate - commission - deductions)
    totalPayable: Number,

    // files: [String], // array of file URLs or paths

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.BuyingSheet ||
  mongoose.model("BuyingSheet", BuyingSheetSchema);
