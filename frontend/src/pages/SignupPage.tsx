import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
  AuthPageBackground,
  EyeIcon,
  MailIcon,
  PinevoxLogo,
  UserIcon,
  useAuthPageStyles,
} from "./authUi";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  useAuthPageStyles();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signup({ name, email, password, role: "analyst" });
      navigate("/dashboard", { replace: true });
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

        <h1 className="pv-heading">Create account</h1>
        <p className="pv-sub">Provision your analyst workspace and access dashboard intelligence.</p>

        <form onSubmit={onSubmit}>
          <div className="pv-field">
            <label className="pv-label" htmlFor="pv-name">
              Full name
            </label>
            <div className="pv-input-wrap">
              <input
                className="pv-input"
                id="pv-name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                autoComplete="name"
                required
              />
              <span className="pv-input-icon">
                <UserIcon />
              </span>
            </div>
          </div>

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
                autoComplete="new-password"
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
          </div>

          <div className="pv-divider" />

          <button className="pv-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="pv-spinner" /> : "Create account"}
          </button>
        </form>

        {error && (
          <div className="pv-status">
            <div className="pv-status-dot" />
            {error}
          </div>
        )}

        <div className="pv-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </>
  );
}
