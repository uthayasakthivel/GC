import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../auth/AuthContext";
import AuthPageLayout from "../components/AuthPageLayout";
import loginImage from "../assets/loginImage.png";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const { login } = useAuth(); // ✅ context login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const dataWithToken = await response.json();
      const { user, token } = dataWithToken;

      if (!response.ok) {
        throw new Error(dataWithToken.message || "Login failed");
      }

      // Optional approval check
      // if (!user.approved) {
      //   showToast("Your account is pending admin approval.", "error");
      //   return;
      // }

      login(user, token); // ✅ Save to context and localStorage
      showToast("Login successful!", "success");

      const role = user.role;
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "manager") navigate("/manager", { replace: true });
      else if (role === "employee") navigate("/employee", { replace: true });
      else showToast("No role assigned. Contact support.", "error");
    } catch (error) {
      console.error("Login error:", error);
      showToast("Login failed: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <AuthPageLayout title="Login" image={loginImage}>
        <input
          type="email"
          className="border p-2 w-full rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="border p-2 w-full rounded pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-600 hover:text-gray-900"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 w-full rounded flex justify-center items-center gap-2 hover:bg-blue-700 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-center mt-6">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const tokenId = credentialResponse.credential;

                const res = await fetch(
                  "http://localhost:5000/api/auth/google-login",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ tokenId }),
                  }
                );

                const data = await res.json();
                if (!res.ok) {
                  throw new Error(data.message || "Google login failed");
                }

                if (data.token) {
                  login(data.user, data.token);
                  showToast("Login successful", "success");

                  const role = data.user.role;
                  if (role === "admin") navigate("/admin", { replace: true });
                  else if (role === "manager")
                    navigate("/manager", { replace: true });
                  else if (role === "employee")
                    navigate("/employee", { replace: true });
                } else {
                  showToast(data.message, "info"); // likely "await approval"
                }
              } catch (err) {
                console.error(err);
                showToast(err.message, "error");
              }
            }}
            onError={() => showToast("Google Login Failed", "error")}
          />
        </div>

        <div className="text-center mt-4">
          <p>
            New user?{" "}
            <button
              type="button"
              className="text-blue-600 underline hover:text-blue-800"
              onClick={() => navigate("/signup")}
            >
              Register here
            </button>
          </p>
          <p
            className="text-sm mt-4 text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>
        </div>
      </AuthPageLayout>
    </form>
  );
}
