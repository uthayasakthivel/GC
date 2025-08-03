// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  console.log(user, "user in private route");
  if (loading) return <div>Loading protected route...</div>;

  if (!user) return <Navigate to="/" />;

  const userRole = user?.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}
