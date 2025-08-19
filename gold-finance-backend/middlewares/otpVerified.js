import otpStore from "../utils/otpStore.js";

export const otpVerified = (req, res, next) => {
  const { phoneNumber } = req.body;
  const entry = otpStore[phoneNumber];
  if (!entry || !entry.verified) {
    return res.status(400).json({ message: "OTP not verified" });
  }
  next();
};
