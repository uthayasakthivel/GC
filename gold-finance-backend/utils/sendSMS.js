// utils/sendSMS.js
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Set in .env
const authToken = process.env.TWILIO_AUTH_TOKEN; // Set in .env
const twilioNumber = process.env.TWILIO_PHONE_NUMBER; // Set in .env

const client = twilio(accountSid, authToken);

export const sendSMS = async (to, message) => {
  return client.messages.create({
    body: message,
    from: twilioNumber,
    to: to,
  });
};
