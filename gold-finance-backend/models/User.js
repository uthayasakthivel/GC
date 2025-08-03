// auth-backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["employee", "manager", "admin"],
      default: "employee",
    },
    isApproved: { type: Boolean, default: false },
    googleId: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
