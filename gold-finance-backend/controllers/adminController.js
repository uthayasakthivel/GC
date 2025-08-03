// auth-backend/controllers/adminController.js
import User from "../models/User.js";

export const listUsers = async (req, res) => {
  try {
    const { role, status } = req.query;

    const filter = {};

    if (role && ["employee", "manager"].includes(role)) {
      filter.role = role;
    }

    if (status === "approved") filter.isApproved = true;
    else if (status === "pending") filter.isApproved = false;

    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["employee", "manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = true;
    user.role = role;
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
