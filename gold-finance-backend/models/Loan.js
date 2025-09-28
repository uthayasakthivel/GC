import mongoose from "mongoose";

const jewelSchema = new mongoose.Schema(
  {
    ornament: { type: String, required: true }, // e.g., Ring, Chain
    numItems: { type: Number, required: true }, // number of pieces
    grossWeight: { type: Number, required: true }, // grams
    netWeight: { type: Number, required: true }, // grams
    ratePerGram: { type: Number, required: true }, // per gram rate
    eligibleAmount: { type: Number, required: true }, // rupees
    partial: { type: Number, default: 0 }, // partial amount if applicable
  },
  { _id: false } // no extra _id for each jewel
);

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

    // Jewellery Details
    jewels: { type: [jewelSchema], required: true }, // array of jewels
    ratePerGram: { type: Number },
    eligibleAmount: { type: Number, required: true, min: 0 }, // total eligibility

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
    status: { type: String, default: "loanopen" },
    linkedToLoanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      default: null,
    },
    partialReleaseAllowed: { type: Boolean, default: true },
    partialReleaseStatus: { type: String, default: "" }, // e.g., "released"
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);
