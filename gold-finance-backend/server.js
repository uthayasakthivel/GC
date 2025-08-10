// auth-backend/server.js
import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import buyingSheetRoutes from "./routes/BuyingSheetRoutes.js";
import sellingSheetRoutes from "./routes/SellingSheetRoutes.js";
import meltingSheetRoutes from "./routes/MeltingSheetRoutes.js";
import adminConfigRoutes from "./routes/admin/adminConfigRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form body

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
// Serve images statically
console.log("Serving uploads from:", path.join(process.cwd(), "uploads"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/config", adminConfigRoutes);
app.use("/api/sheet", buyingSheetRoutes);
app.use("/api/sheet", sellingSheetRoutes);
app.use("/api/sheet", meltingSheetRoutes);

app.get("/", (req, res) => res.send("API running"));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
