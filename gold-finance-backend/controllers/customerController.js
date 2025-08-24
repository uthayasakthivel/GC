import Branch from "../models/Branch.js";
import Customer from "../models/Customer.js";
import { getNextCustomerId } from "../utils/getNextCustomerId.js";

export const registerCustomer = async (req, res) => {
  try {
    const {
      branch,
      branchId,
      customerName,
      phoneNumber,
      address,
      aadharNumber,
    } = req.body;
    // Find branch document by branchId
    const branchDoc = await Branch.findById(branchId);
    if (!branchDoc) return res.status(400).json({ message: "Invalid branch" });

    const branchCode = branchDoc.code; // Use this dynamically

    const customerId = await getNextCustomerId(branchCode);

    const customer = new Customer({
      date: new Date(),
      branch,
      branchId,
      customerId,
      customerName,
      phoneNumber,
      address,
      aadharNumber,
    });

    await customer.save();
    res.status(201).json({ customer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};
// ✅ Search customer by customerId or phoneNumber
export const searchCustomer = async (req, res) => {
  try {
    const { idOrPhone } = req.params;
    console.log(idOrPhone, "iiiiiiiiiii");

    // Search by customerId OR phoneNumber
    const customer = await Customer.findOne({
      $or: [{ customerId: idOrPhone }, { phoneNumber: idOrPhone }],
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
