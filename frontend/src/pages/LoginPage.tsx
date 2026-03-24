import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { AuthPageBackground, EyeIcon, MailIcon, PinevoxLogo, useAuthPageStyles } from "./authUi";

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

      <div className="pv-card">
        <div className="pv-logo">
          <PinevoxLogo />
          <div>
            <span className="pv-logo-name">PINEVOX</span>
            <span className="pv-logo-tag">Telecom Intelligence Platform</span>
          </div>
        </div>

        <h1 className="pv-heading">Welcome back</h1>
        <p className="pv-sub">Authenticate to access the dashboard.</p>

        <form onSubmit={onSubmit}>
          <div className="pv-field">
            <label className="pv-label" htmlFor="pv-email">
              Email address
            </label>
            <div className="pv-input-wrap">
              <input
                className="pv-input"
                id="pv-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
              <span className="pv-input-icon">
                <MailIcon />
              </span>
            </div>
          </div>

          <div className="pv-field">
            <label className="pv-label" htmlFor="pv-password">
              Password
            </label>
            <div className="pv-input-wrap">
              <input
                className="pv-input"
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
                className="pv-toggle"
                onClick={() => setShowPw((value) => !value)}
                type="button"
                aria-label="Toggle password"
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
            <div className="pv-meta">
              <a
                href="#"
                className="pv-link"
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div className="pv-divider" />

          <button className="pv-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="pv-spinner" /> : "Authenticate"}
          </button>
        </form>

        {error && (
          <div className="pv-status">
            <div className="pv-status-dot" />
            {error}
          </div>
        )}

        <div className="pv-footer">
          New user? <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </>
  );
}
