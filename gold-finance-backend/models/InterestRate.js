import mongoose from "mongoose";

const interestRateSchema = new mongoose.Schema(
  {
    rate: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("InterestRate", interestRateSchema);
