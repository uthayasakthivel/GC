import BuyingSheet from "../models/BuyingSheet.js";

export const createBuyingSheet = async (req, res) => {
  try {
    const {
      branchId,
      date,
      goldDetails,
      buyingRate,
      commission,
      deductions,
      netAmount,
      totalPayable,
      files,
      notes,
    } = req.body;

    const buyingSheet = new BuyingSheet({
      branchId,
      date,
      goldDetails,
      buyingRate,
      commission,
      deductions,
      netAmount,
      totalPayable,
      files,
      notes,
      createdBy: req.user.id,
    });

    const savedSheet = await buyingSheet.save();
    res.status(201).json(savedSheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create buying sheet" });
  }
};
