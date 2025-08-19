// middlewares/validateRegistration.js
export const validateRegistration = (req, res, next) => {
  const { branch, customerName, phoneNumber, address, aadharNumber } = req.body;
  if (!branch || !customerName || !phoneNumber || !address || !aadharNumber) {
    return res
      .status(400)
      .json({ message: "Missing required registration fields" });
  }
  next();
};
