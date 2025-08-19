import mongoose from "mongoose";

const financeSheetSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    sheetNumber: {
      type: String,
      required: true,
    },
    customerName: String,
    phoneNumber: String,
    refPerson: String,
    amountPaid: Number,
    interest: Number, // percentage
    disbursedDate: Date,
    receivedDate: Date,
    noOfDays: Number,
    totalInterest: Number,
    receivedAmount: Number,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    preparedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("FinanceSheet", financeSheetSchema);
