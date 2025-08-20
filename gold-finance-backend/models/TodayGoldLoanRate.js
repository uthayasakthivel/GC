import mongoose from "mongoose";

const todayGoldLoanRateSchema = new mongoose.Schema(
  {
    ratePerGram: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TodayGoldLoanRate", todayGoldLoanRateSchema);
