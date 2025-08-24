import { useState } from "react";

export const useCustomerForm = (loanContext) => {
  const {
    customerData,
    setCustomerData,
    showOtp,
    setShowOtp,
    otp,
    setOtp,
    otpVerified,
    otpError,
    customerId,
    customerIdGenerated,
    loadingCustomerId,
    address,
    setAddress,
    aadharNumber,
    setAadharNumber,
    onSendOtp,
    onOtpVerified,
    generateCustomerId,
    showJewelleryTable,
    setShowJewelleryTable,
  } = loanContext;

  return {
    customerData,
    setCustomerData,
    showOtp,
    setShowOtp,
    otp,
    setOtp,
    otpVerified,
    otpError,
    customerId,
    customerIdGenerated,
    loadingCustomerId,
    address,
    setAddress,
    aadharNumber,
    setAadharNumber,
    onSendOtp,
    onOtpVerified,
    generateCustomerId,
    showJewelleryTable,
    setShowJewelleryTable,
  };
};
