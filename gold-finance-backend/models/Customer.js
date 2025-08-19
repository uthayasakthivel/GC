// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  customerId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  aadharNumber: {
    type: String,
    required: true,
  },
  // jewels: To be added after initial registration
});

export default mongoose.model("Customer", customerSchema);
