import dotenv from "dotenv";
dotenv.config(); // Make sure env variables are loaded before anything else

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = twilio(accountSid, authToken);

// Send OTP via Twilio Verify
export const sendOTP = async (req, res) => {
  let { phoneNumber } = req.body;
  if (!phoneNumber.startsWith("+91")) {
    phoneNumber = "+91" + phoneNumber.replace(/^0+/, ""); // remove any leading zeros
  }
  console.log(verifyServiceSid, "kkkk");
  try {
    await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Twilio Verify Error:", err.message);
    res.status(500).json({ message: "Failed to send OTP SMS" });
  }
};

// Verify OTP via Twilio Verify
export const verifyOTP = async (req, res) => {
  let { phoneNumber, otp } = req.body;
  // Ensure E.164 format for India
  if (!phoneNumber.startsWith("+91")) {
    phoneNumber = "+91" + phoneNumber.replace(/^0+/, "");
  }
  try {
    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === "approved") {
      res.json({ verified: true });
    } else {
      res
        .status(401)
        .json({ verified: false, message: "Invalid or expired OTP" });
    }
  } catch (err) {
    console.error("Twilio Verify Check Error:", err.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
