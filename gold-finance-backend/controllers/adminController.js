// auth-backend/controllers/adminController.js
import User from "../models/User.js";

export const listUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await User.find({ role });
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = true;
    await user.save();
    res.json({ message: "User approved successfully" });
  } catch {
    res.status(500).json({ message: "Failed to approve user" });
  }
};
