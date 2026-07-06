import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {

  const role = localStorage.getItem("role");

  const user = auth.currentUser;

  // NOT LOGGED IN
  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  // ROLE NOT ALLOWED
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {

    if (role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    if (role === "stylist") {
      return <Navigate to="/stylist" replace />;
    }

    return <Navigate to="/book" replace />;
  }

  return children;
}