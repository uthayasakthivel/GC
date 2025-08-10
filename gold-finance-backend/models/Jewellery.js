import mongoose from "mongoose";

const jewellerySchema = new mongoose.Schema({
  jewelleryName: {
    type: String,
    unique: true,
    trim: true,
  },
});

const Jewellery = mongoose.model("Jewellery", jewellerySchema);

export default Jewellery;
