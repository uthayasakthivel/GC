import mongoose from "mongoose";

const meltingSheetSchema = new mongoose.Schema({
  sheetNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  meltingCenter: {
    type: String,
    required: true,
  },
  meltingPlace: {
    type: String,
    required: true,
  },
  meltingRefPerson: {
    type: String,
    required: true,
  },

  // articleId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Jewellery",
  //   required: true,
  // },
  buyingSheetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BuyingSheet",
    required: true,
  },
  buyingSheetNumber: {
    type: String,
    required: true,
  },
  buyingCustomerName: {
    type: String,
    required: true,
  },
  goldDetails: {
    grossWeight: { type: Number, required: true },
    afterStone: { type: Number, required: true },
    afterMelting: { type: Number, required: true },
    kacchaPurity: { type: Number, required: true },
  },
  rateDetails: {
    buyingRate: Number,
    sellingRate: { type: Number, required: true },
    totalAmountRecieved: { type: Number, required: true },
    amountDisbursedMethod: String, // "cash", "account", or "both"
    amountFromOnline: Number,
    amountFromOffline: Number,
    netProfit: { type: Number, required: true },
  },
  preparedBy: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: [String], // array of image file paths
});

export default mongoose.model("MeltingSheet", meltingSheetSchema);
