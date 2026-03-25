import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { AuthPageBackground, EyeIcon, LockIcon, MailIcon, SparkIcon, useAuthPageStyles } from "./authUi";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useAuthPageStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AuthPageBackground />

      <div className="pv-card pv-login-card">
        <div className="pv-login-badge" aria-hidden="true">
          <SparkIcon />
        </div>

        <h1 className="pv-login-heading">Welcome Back</h1>

        <form className="pv-login-form" onSubmit={onSubmit}>
          <div className="pv-login-field">
            <div className="pv-login-input-shell">
              <span className="pv-login-lead" aria-hidden="true">
                <MailIcon />
              </span>
              <input
                className="pv-login-input"
                id="pv-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="pv-login-field">
            <div className="pv-login-input-shell">
              <span className="pv-login-lead" aria-hidden="true">
                <LockIcon />
              </span>
              <input
                className="pv-login-input pv-login-input-password"
                id="pv-password"
                type={showPw ? "text" : "password"}
                placeholder=".........."
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                minLength={8}
                required
              />
              <button
                className="pv-login-toggle"
                onClick={() => setShowPw((value) => !value)}
                type="button"
                aria-label="Toggle password"
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

          <button className="pv-login-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="pv-spinner" /> : "Login"}
          </button>
        </form>

        {error && (
          <div className="pv-status pv-login-status">
            <div className="pv-status-dot" />
            {error}
          </div>
        )}

        <div className="pv-login-footer">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  );
}
