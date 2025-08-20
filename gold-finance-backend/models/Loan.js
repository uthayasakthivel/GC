import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    loanId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);
