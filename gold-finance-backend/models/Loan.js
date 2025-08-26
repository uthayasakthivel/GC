import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    loanId: { type: String, required: true, unique: true }, // From nextLoanNumber
    customerId: { type: String, required: true },
    branches: { type: Array, default: [] }, // From branches JSON
    selectedBranch: { type: String },

    // Customer Info
    customerData: { type: Object, default: {} },
    address: { type: String },
    aadharNumber: { type: String },
    otpVerified: { type: Boolean, default: false },

    // Jewellery Config
    jewelleryOptions: { type: Array, default: [] },
    ratePerGram: { type: Number },

    // Loan Details
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

    // Images
    images: {
      customerPhoto: { type: String },
      jewelPhoto: { type: String },
      aadharPhoto: { type: String },
      declarationPhoto: { type: String },
      otherPhoto: { type: String },
    },

    // Sheet Prepared By
    sheetPreparedBy: { type: String },

    // lastInterestPaidDate
    lastInterestPaidDate: {
      type: Date,
      default: null,
    },

    // Preview Data
    previewData: { type: Object, default: {} },

    // Status
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);
