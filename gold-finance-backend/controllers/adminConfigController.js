// controllers/adminConfigController.js
import Branch from "../models/Branch.js";
import { AdminData } from "../models/AdminData.js";

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
    const branch = new Branch({
      name: req.body.name,
      location: req.body.location,
    });
    await branch.save();
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ error: "Failed to create branch" });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const updated = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
