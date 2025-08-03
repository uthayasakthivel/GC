// File: controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "employee" : role || "employee";

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      isApproved: false,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Signup successful. Await admin approval." });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isApproved)
      return res.status(403).json({ message: "Account not approved yet" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch {
    res.status(500).json({ message: "Signin failed" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      if (!user.isApproved)
        return res
          .status(403)
          .json({ message: "Your account is not approved yet" });

      const token = generateToken(user);
      return res.json({ token, user });
    }

    user = new User({
      name,
      email,
      googleId,
      role: "employee",
      isApproved: false,
    });

    await user.save();

    return res.status(201).json({
      message: "Account created. Await admin approval before login.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `<p>Click to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
      },
      (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          return res
            .status(500)
            .json({ message: "Failed to send reset email" });
        } else {
          console.log("Email sent:", info.response);
          return res.json({ message: "Password reset email sent" });
        }
      }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch {
    res.status(500).json({ message: "Password reset failed" });
  }
};

export const listUsers = async (req, res) => {
  try {
    const { role } = req.query;

    if (!["employee", "manager"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const users = await User.find({ role });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
