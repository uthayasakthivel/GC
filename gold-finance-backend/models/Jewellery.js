import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  jewelleryName: {
    type: String,
    unique: true,
    trim: true,
  },
});

const Jewellery = mongoose.model("Jewellery", branchSchema);

export default Jewellery;
