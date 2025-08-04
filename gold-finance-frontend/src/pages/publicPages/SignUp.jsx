import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ToastContext";
import AuthPageLayout from "../../components/pageLayouts/AuthPageLayout";
import signupImage from "../../assets/signupImage.jpg";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name: email.split("@")[0], // default name from email prefix
          role: "employee",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      showToast(
        "Registration successful! Wait for admin approval before login.",
        "success"
      );
      navigate("/login");
    } catch (error) {
      console.error("Sign up error:", error);
      showToast("Sign up failed: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <AuthPageLayout title="Sign Up" image={signupImage}>
        <input
          type="email"
          className="border p-2 w-full rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {/* Fixed Employee Role - not editable */}
        <input
          type="text"
          value="Employee"
          readOnly
          className="border p-2 w-full rounded bg-gray-100 text-gray-500 cursor-not-allowed"
        />

        <button
          type="submit"
          className={`bg-green-600 text-white px-4 py-2 w-full rounded hover:bg-green-700 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </AuthPageLayout>
    </form>
  );
}
