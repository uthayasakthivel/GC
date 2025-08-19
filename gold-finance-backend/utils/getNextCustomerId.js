// utils/getNextCustomerId.js
import Customer from "../models/Customer.js";

export const getNextCustomerId = async (branchCode) => {
  const regex = new RegExp(`^${branchCode}\\d+$`);
  const lastCustomer = await Customer.find({ customerId: { $regex: regex } })
    .sort({ customerId: -1 })
    .limit(1);

  let nextNumber = "001";
  if (lastCustomer.length) {
    const lastIdNum = parseInt(
      lastCustomer[0].customerId.replace(branchCode, "")
    );
    nextNumber = String(lastIdNum + 1).padStart(3, "0");
  }
  return `${branchCode}${nextNumber}`;
};
