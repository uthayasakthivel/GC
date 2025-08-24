export default function OtpVerification({
  otp,
  setOtp,
  otpError,
  onOtpVerified,
}) {
  return (
    <div className="mt-4">
      <label className="block mb-1 font-semibold">Enter OTP</label>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP"
        className="w-full px-3 py-2 border rounded mb-2"
      />
      <button
        onClick={onOtpVerified}
        className="bg-red-600 text-white w-full px-4 py-2 rounded"
      >
        Verify OTP
      </button>
      {otpError && <p className="text-red-600 mt-1">{otpError}</p>}
    </div>
  );
}
