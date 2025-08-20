import mongoose from "mongoose";

const interestRateSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    percentage: { type: Number, required: true },
    factor: { type: Number, required: true },
  },
  { timestamps: true }
);

const InterestRate = mongoose.model("InterestRate", interestRateSchema);

export default InterestRate;
