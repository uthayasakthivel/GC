// src/components/GoogleLoginButton.jsx
import React from "react";
import { auth, provider } from "../auth/firebase"; // make sure you export `provider`
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import { useToast } from "./ToastContext";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // New user, save to Firestore
        await setDoc(userRef, {
          email: user.email,
          role: "employee", // default role
          approved: false,
        });
        showToast("Signed in via Google. Awaiting admin approval.", "info");
      } else {
        const data = userSnap.data();
        if (!data.approved) {
          showToast("Account not approved yet.", "error");
          return;
        }

        // Redirect based on role
        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "manager") {
          navigate("/manager");
        } else if (data.role === "employee") {
          navigate("/employee");
        } else {
          showToast("No role assigned. Contact support.", "error");
          navigate("/");
        }
        showToast("Login successful!", "success");
      }
    } catch (error) {
      console.error("Google login error:", error);
      showToast("Google login failed.", "error");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-white text-black border border-gray-300 px-4 py-2 rounded shadow hover:shadow-lg w-full mt-4"
    >
      Sign in with Google
    </button>
  );
}
