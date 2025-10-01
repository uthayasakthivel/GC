import mongoose from "mongoose";

const jewelSchema = new mongoose.Schema(
  {
    ornament: { type: String, required: true },
    numItems: { type: Number, required: true },
    grossWeight: { type: Number, required: true },
    netWeight: { type: Number, required: true },
    ratePerGram: { type: Number, required: true },
    eligibleAmount: { type: Number, required: true },
    partial: { type: Number, default: 0 },

    // ✅ Add release metadata
    released: { type: Boolean, default: false },
    releasedFromLoanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },
    releasedDate: { type: Date },
  },
  { _id: false }
);

const loanSchema = new mongoose.Schema(
  {
    loanId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    branches: { type: Array, default: [] },
    selectedBranch: { type: String },

    customerData: { type: Object, default: {} },
    address: { type: String },
    aadharNumber: { type: String },
    otpVerified: { type: Boolean, default: false },

    jewels: { type: [jewelSchema], required: true },
    ratePerGram: { type: Number },
    eligibleAmount: { type: Number, required: true, min: 0 },

    loanAmount: { type: Number },
    selectedInterestRate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterestRate",
    },
    loanDate: { type: String },
    loanPeriod: { type: String },
    dueDate: { type: String },
    noOfDays: { type: Number },
    selectedFactor: { type: Number },
    totalInterest: { type: Number },
    paymentMethod: { type: String },
    paymentByOffline: { type: String },
    paymentByOnline: { type: String },
    refNumber: { type: String },

    images: {
      customerPhoto: { type: String },
      jewelPhoto: { type: String },
      aadharPhoto: { type: String },
      declarationPhoto: { type: String },
      otherPhoto: { type: String },
    },

    sheetPreparedBy: { type: String },
    lastInterestPaidDate: { type: Date, default: null },
    previewData: { type: Object, default: {} },

    status: { type: String, default: "loanopen" },
    linkedToLoanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      default: null,
    },
    partialReleaseAllowed: { type: Boolean, default: true },
    partialReleaseStatus: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);
