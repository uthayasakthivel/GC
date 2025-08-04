import React, { useState } from "react";
import { useToast } from "../../components/ToastContext";
import { useNavigate } from "react-router-dom";
import forgotPasswordImage from "../../assets/forgotPasswordImage.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      showToast("Password reset email sent! Check your inbox.", "success");
      navigate("/login");
    } catch (error) {
      console.error("Reset error:", error);
      showToast("Failed to send reset email: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl mx-auto">
        {/* Image side */}
        <div className="w-full md:w-1/2 h-48 md:h-auto relative overflow-hidden">
          <img
            src={forgotPasswordImage}
            alt="Forgot password visual"
            className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </div>

        {/* Form side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
          <form onSubmit={handleReset} className="w-full max-w-md space-y-6">
            <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

            <input
              type="email"
              placeholder="Enter your registered email"
              className="border border-gray-300 rounded-md p-3 w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white rounded-md py-3 w-full font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:outline-none transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
