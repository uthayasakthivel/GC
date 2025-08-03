import { auth } from "../auth/firebase";

export const callProtectedAPI = async () => {
  try {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch("http://localhost:5000/api/secure-data", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error calling API:", err);
    throw err;
  }
};
