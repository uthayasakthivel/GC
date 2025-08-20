// auth-backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import buyingSheetRoutes from "./routes/BuyingSheetRoutes.js";
import sellingSheetRoutes from "./routes/SellingSheetRoutes.js";
import meltingSheetRoutes from "./routes/MeltingSheetRoutes.js";
import financeSheetRoutes from "./routes/financeSheetRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import adminConfigRoutes from "./routes/admin/adminConfigRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form body

// Serve images statically
console.log("Serving uploads from:", path.join(process.cwd(), "uploads"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
console.log("Verify SID:", process.env.TWILIO_VERIFY_SERVICE_SID);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/config", adminConfigRoutes);
app.use("/api/sheet", buyingSheetRoutes);
app.use("/api/sheet", sellingSheetRoutes);
app.use("/api/sheet", meltingSheetRoutes);
app.use("/api/sheet", financeSheetRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/loan", loanRoutes);

app.get("/", (req, res) => res.send("API running"));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
