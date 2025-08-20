// controllers/adminConfigController.js
import Branch from "../models/Branch.js";
import { AdminData } from "../models/AdminData.js";
import Jewellery from "../models/Jewellery.js";
import TodayGoldLoanRate from "../models/TodayGoldLoanRate.js";
import InterestRate from "../models/InterestRate.js";
import { getNextCustomerId } from "../utils/getNextCustomerId.js";

// ---------- Branch Controllers ----------
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch branches" });
  }
};

export const createBranch = async (req, res) => {
  try {
    const { name, location, code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Branch code is required" });
    }

    const branch = new Branch({ name, location, code });
    await branch.save();
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ error: "Failed to create branch" });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { name, location, code } = req.body;
    if (code === undefined) {
      return res.status(400).json({ error: "Branch code is required" });
    }

    const updated = await Branch.findByIdAndUpdate(
      req.params.id,
      { name, location, code },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Branch not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update branch" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const deleted = await Branch.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Branch not found" });
    res.json({ message: "Branch deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete branch" });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ error: "Branch not found" });
    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch branch" });
  }
};

// ---------- Admin Data (Rates & Balance) ----------
const getAdminData = async () => {
  let data = await AdminData.findOne();
  if (!data) {
    data = new AdminData({
      todayRates: {
        gold22k: 0,
        gold24k: 0,
        silver: 0,
        createdAt: new Date(),
      },
      buyingRates: {
        gold22k916: 0,
        gold22k: 0,
        silver: 0,
        createdAt: new Date(),
      },
      openingBalance: {
        cash: 0,
        goldGrams: 0,
      },
    });
    await data.save();
  }
  return data;
};

export const getTodayRates = async (req, res) => {
  try {
    const data = await getAdminData();
    res.json(data.todayRates);
  } catch (err) {
    res.status(500).json({ error: "Failed to get today rates" });
  }
};

export const setTodayRates = async (req, res) => {
  try {
    console.log("setTodayRates req.body:", req.body);

    const { gold22k, gold24k, silver } = req.body;

    if (
      typeof gold22k !== "number" ||
      typeof gold24k !== "number" ||
      typeof silver !== "number"
    ) {
      return res.status(400).json({ error: "All rate fields must be numbers" });
    }

    const data = await getAdminData();

    // Use set() or assign fields individually to avoid Mongoose validation issues
    data.set("todayRates", {
      gold22k,
      gold24k,
      silver,
      createdAt: new Date(),
    });

    // or alternatively:
    // data.todayRates.gold22k = gold22k;
    // data.todayRates.gold24k = gold24k;
    // data.todayRates.silver = silver;
    // data.todayRates.createdAt = new Date();

    await data.save();

    res.status(200).json({
      message: "Today rates updated",
      todayRates: data.todayRates,
    });
  } catch (error) {
    console.error("setTodayRates error:", error);
    res.status(500).json({ error: "Failed to update today rates" });
  }
};

export const getBuyingRates = async (req, res) => {
  try {
    const data = await getAdminData();
    res.json(data.buyingRates);
  } catch (err) {
    res.status(500).json({ error: "Failed to get buying rates" });
  }
};

export const setBuyingRates = async (req, res) => {
  try {
    console.log("setBuyingRates req.body:", req.body);

    const { gold22k916, gold22k, silver } = req.body;

    if (
      typeof gold22k916 !== "number" ||
      typeof gold22k !== "number" ||
      typeof silver !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "All buying rate fields must be numbers" });
    }

    const data = await getAdminData();

    data.set("buyingRates", {
      gold22k916,
      gold22k,
      silver,
      createdAt: new Date(),
    });

    await data.save();

    res.status(200).json({
      message: "Buying rates updated",
      buyingRates: data.buyingRates,
    });
  } catch (error) {
    console.error("setBuyingRates error:", error);
    res.status(500).json({ error: "Failed to update buying rates" });
  }
};

export const getOpeningBalance = async (req, res) => {
  try {
    const data = await getAdminData();
    res.json(data.openingBalance);
  } catch (err) {
    res.status(500).json({ error: "Failed to get opening balance" });
  }
};

export const getClosingBalance = async (req, res) => {
  try {
    const data = await getAdminData();
    res.json(data.closingBalance || { cash: 0, goldGrams: 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to get closing balance" });
  }
};

export const updateClosingBalance = async (totalAmountSpend, netWeight) => {
  const adminData = await getAdminData();

  // Calculate new balances
  const newClosingCash =
    parseFloat(adminData.openingBalance.cash) - parseFloat(totalAmountSpend);
  const newClosingGold =
    parseFloat(adminData.openingBalance.goldGrams) + parseFloat(netWeight);

  // Update in DB (make sure your AdminData schema has these fields)
  adminData.closingBalance = {
    cash: newClosingCash,
    goldGrams: newClosingGold,
  };

  await adminData.save();

  return adminData.closingBalance;
};

export const updateClosingBalanceAfterSelling = async (
  netAmountReceived,
  grossWeight
) => {
  const adminData = await getAdminData();

  const newClosingCash =
    parseFloat(adminData.openingBalance.cash) + parseFloat(netAmountReceived);
  const newClosingGold =
    parseFloat(adminData.openingBalance.goldGrams) - parseFloat(grossWeight);

  adminData.closingBalance = {
    cash: newClosingCash,
    goldGrams: newClosingGold,
  };

  await adminData.save();

  return adminData.closingBalance;
};

// Create Jewellery Type
export const createJewellery = async (req, res) => {
  try {
    const { jewelleryName } = req.body;

    const exists = await Jewellery.findOne({ jewelleryName });
    if (exists) {
      return res.status(400).json({ message: "Jewellery type already exists" });
    }

    const newJewellery = new Jewellery({ jewelleryName });
    await newJewellery.save();

    res
      .status(201)
      .json({ message: "Jewellery type added", data: newJewellery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Jewellery Types
export const getJewelleryList = async (req, res) => {
  try {
    const list = await Jewellery.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Jewellery
export const getJewelleryById = async (req, res) => {
  try {
    const item = await Jewellery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Jewellery not found" });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Jewellery Name
export const updateJewellery = async (req, res) => {
  try {
    const { jewelleryName } = req.body;

    const updated = await Jewellery.findByIdAndUpdate(
      req.params.id,
      { jewelleryName },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Jewellery not found" });

    res.status(200).json({ message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Jewellery
export const deleteJewellery = async (req, res) => {
  try {
    const deleted = await Jewellery.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Jewellery not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Interest Rate
export const createInterestRate = async (req, res) => {
  try {
    const { rate } = req.body;

    if (rate === undefined || rate === null) {
      return res.status(400).json({ message: "Rate is required" });
    }

    const interestRate = new InterestRate({
      rate,
      createdBy: req.user.id,
    });

    const savedRate = await interestRate.save();
    res.status(201).json(savedRate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all interest rates
// export const getInterestRates = async (req, res) => {
//   try {
//     const rates = await InterestRate.find()
//       .populate("createdBy", "name email")
//       .populate("updatedBy", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json(rates);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get single interest rate by ID
// export const getInterestRateById = async (req, res) => {
//   try {
//     const rate = await InterestRate.findById(req.params.id)
//       .populate("createdBy", "name email")
//       .populate("updatedBy", "name email");

//     if (!rate) {
//       return res.status(404).json({ message: "Interest rate not found" });
//     }

//     res.status(200).json(rate);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Update interest rate
// export const updateInterestRate = async (req, res) => {
//   try {
//     const { rate } = req.body;

//     const updatedRate = await InterestRate.findByIdAndUpdate(
//       req.params.id,
//       { rate, updatedBy: req.user.id },
//       { new: true }
//     );

//     if (!updatedRate) {
//       return res.status(404).json({ message: "Interest rate not found" });
//     }

//     res.status(200).json(updatedRate);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete interest rate
// export const deleteInterestRate = async (req, res) => {
//   try {
//     const deleted = await InterestRate.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({ message: "Interest rate not found" });
//     }

//     res.status(200).json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getNextCustomerIdApi = async (req, res) => {
  try {
    console.log("hiasdlkfjasdlkfj");
    const branchCode = req.query.branchCode;
    if (!branchCode) {
      return res
        .status(400)
        .json({ message: "branchCode query parameter is required" });
    }

    const nextCustomerId = await getNextCustomerId(branchCode);
    res.json({ customerId: nextCustomerId });
  } catch (err) {
    console.error("getNextCustomerIdApi error:", err);
    res.status(500).json({ message: "Failed to get next customer ID" });
  }
};

// GET the current TodayGoldLoanRate (single record)
export const getTodayGoldLoanRate = async (req, res) => {
  try {
    const rate = await TodayGoldLoanRate.findOne();
    if (!rate)
      return res.status(404).json({ error: "TodayGoldLoanRate not set" });
    res.json(rate);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TodayGoldLoanRate" });
  }
};

// CREATE TodayGoldLoanRate (only once, if not exists)
export const createTodayGoldLoanRate = async (req, res) => {
  try {
    const { ratePerGram, notes } = req.body;
    if (!ratePerGram) {
      return res.status(400).json({ error: "Rate per gram is required" });
    }

    // Check if it already exists
    const existing = await TodayGoldLoanRate.findOne();
    if (existing) {
      return res
        .status(400)
        .json({ error: "Rate already exists. Use update instead." });
    }

    const rate = new TodayGoldLoanRate({ ratePerGram, notes });
    await rate.save();
    res.status(201).json(rate);
  } catch (err) {
    res.status(400).json({ error: "Failed to create TodayGoldLoanRate" });
  }
};

// UPDATE TodayGoldLoanRate (replace old with new)
export const updateTodayGoldLoanRate = async (req, res) => {
  try {
    const { ratePerGram, notes } = req.body;
    if (ratePerGram === undefined) {
      return res.status(400).json({ error: "Rate per gram is required" });
    }

    const updated = await TodayGoldLoanRate.findOneAndUpdate(
      {},
      { ratePerGram, notes },
      { new: true, upsert: true } // ensures always one record exists
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update TodayGoldLoanRate" });
  }
};

// DELETE TodayGoldLoanRate (optional)
export const deleteTodayGoldLoanRate = async (req, res) => {
  try {
    const deleted = await TodayGoldLoanRate.findOneAndDelete();
    if (!deleted)
      return res.status(404).json({ error: "No TodayGoldLoanRate found" });
    res.json({ message: "TodayGoldLoanRate deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete TodayGoldLoanRate" });
  }
};

// Get interest rates (latest or all)
export const getInterestRates = async (req, res) => {
  try {
    const rates = await InterestRate.find().sort({ createdAt: -1 });
    res.status(200).json(rates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch interest rates", error });
  }
};

// Set (add) interest rates
export const setInterestRates = async (req, res) => {
  try {
    const { price, percentage, factor } = req.body;

    // Validate input
    if (price == null || percentage == null || factor == null) {
      return res
        .status(400)
        .json({
          message: "All fields (price, percentage, factor) are required.",
        });
    }

    const newRate = new InterestRate({ price, percentage, factor });
    await newRate.save();

    res
      .status(201)
      .json({ message: "Interest rate added successfully", rate: newRate });
  } catch (error) {
    res.status(500).json({ message: "Failed to set interest rate", error });
  }
};

export const addToOpeningBalance = async (req, res) => {
  try {
    const data = await getAdminData();
    const cashToAdd = Number(req.body.cash) || 0;
    const goldToAdd = Number(req.body.goldGrams) || 0;
    data.openingBalance.cash += cashToAdd;
    data.openingBalance.goldGrams += goldToAdd;
    await data.save();
    res.json({
      message: "Opening balance added",
      openingBalance: data.openingBalance,
    });
  } catch (err) {
    res.status(400).json({ error: "Failed to add to opening balance" });
  }
};
