import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading session...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
