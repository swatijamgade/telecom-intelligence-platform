import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div style={{ padding: 20 }}>Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
