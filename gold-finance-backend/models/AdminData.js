// models/AdminData.js
import mongoose from "mongoose";

const adminDataSchema = new mongoose.Schema(
  {
    todayRates: {
      gold22k: { type: Number, required: true },
      gold24k: { type: Number, required: true },
      silver: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    },
    buyingRates: {
      gold22k916: { type: Number, required: true },
      gold22k: { type: Number, required: true },
      silver: { type: Number, required: true },
    },
    openingBalance: {
      cash: { type: Number, default: 0 },
      goldGrams: { type: Number, default: 0 },
    },
    closingBalance: {
      cash: {
        type: Number,
        default: 0,
      },
      goldGrams: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

export const AdminData = mongoose.model("AdminData", adminDataSchema);
