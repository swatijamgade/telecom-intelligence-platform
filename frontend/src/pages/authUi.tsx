import { useEffect } from "react";

const STYLE_ID = "pinevox-auth-page-style";

const AUTH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #040a15;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #root {
    width: 100%;
    min-height: 100vh;
    padding: 20px 14px;
    position: relative;
    display: grid;
    place-items: center;
  }

  .pv-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(56,189,248,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.07) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(circle at 50% 38%, #000 20%, transparent 95%);
    pointer-events: none;
    z-index: 0;
  }

  .pv-glow {
    position: fixed;
    width: 760px;
    height: 760px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.11) 0%, rgba(14,165,233,0.06) 36%, transparent 70%);
    top: 28%;
    left: 50%;
    transform: translate(-50%, -40%);
    pointer-events: none;
    z-index: 0;
    filter: blur(18px);
  }

  .pv-bg--pastel {
    background-image: none;
    background: linear-gradient(110deg, #eeebfb 0%, #f8e8f2 100%);
    mask-image: none;
  }

  .pv-glow--pastel {
    width: min(96vw, 1040px);
    height: min(96vw, 840px);
    border-radius: 38%;
    background:
      radial-gradient(circle at 22% 24%, rgba(177, 129, 255, 0.19) 0%, rgba(177, 129, 255, 0.02) 56%),
      radial-gradient(circle at 78% 76%, rgba(243, 110, 170, 0.2) 0%, rgba(243, 110, 170, 0.02) 58%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -52%);
    filter: blur(2px);
  }

  .pv-card {
    position: relative;
    z-index: 1;
    width: min(100%, 420px);
    padding: clamp(24px, 5vw, 34px);
    border-radius: 16px;
    background: linear-gradient(180deg, rgba(14, 22, 36, 0.98) 0%, rgba(11, 19, 32, 0.98) 100%);
    border: 1px solid rgba(106, 154, 208, 0.22);
    box-shadow:
      inset 0 1px 0 rgba(160, 200, 255, 0.08),
      0 26px 80px rgba(0, 0, 0, 0.5);
    animation: pvFadeUp 0.45s ease both;
    backdrop-filter: blur(2px);
  }

  @keyframes pvFadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .pv-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 30px;
  }

  .pv-logo-mark {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    filter: drop-shadow(0 0 10px rgba(56,189,248,0.4));
  }

  .pv-logo-rotor {
    transform-origin: center;
    transform-box: fill-box;
    animation: pvLogoRotate 7.5s linear infinite;
  }

  @keyframes pvLogoRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .pv-logo-name {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 15px;
    line-height: 1;
    letter-spacing: 0.16em;
    color: #36c0ff;
  }

  .pv-logo-tag {
    display: block;
    margin-top: 3px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #5f7a9f;
  }

  .pv-heading {
    margin-bottom: 8px;
    font-size: 22px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #f1f6fc;
  }

  .pv-sub {
    font-size: 14px;
    line-height: 1.45;
    color: #7f95b4;
    margin-bottom: 30px;
  }

  .pv-label {
    display: block;
    margin-bottom: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7b8da9;
  }

  .pv-field {
    margin-bottom: 16px;
  }

  .pv-input-wrap {
    position: relative;
  }

  .pv-input {
    width: 100%;
    border-radius: 8px;
    border: 1px solid rgba(129, 163, 204, 0.24);
    background: linear-gradient(90deg, rgba(21, 33, 52, 0.75) 0%, rgba(21, 33, 52, 0.64) 100%);
    color: #ecf4ff;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.2;
    padding: 12px 42px 12px 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
    -webkit-appearance: none;
  }

  .pv-input::placeholder {
    color: #6a7f9e;
  }

  .pv-input:focus {
    border-color: rgba(56, 189, 248, 0.72);
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.14);
    background: rgba(20, 32, 52, 0.95);
  }

  .pv-input-icon {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    color: #4f6788;
    pointer-events: none;
  }

  .pv-toggle {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    border: 0;
    background: transparent;
    color: #4f6788;
    padding: 0;
    line-height: 0;
    cursor: pointer;
    transition: color 0.2s;
  }

  .pv-toggle:hover {
    color: #86a9d5;
  }

  .pv-meta {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }

  .pv-link {
    color: #36c0ff;
    font-size: 13px;
    line-height: 1.3;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .pv-link:hover {
    opacity: 0.75;
  }

  .pv-divider {
    width: 100%;
    height: 1px;
    margin: 24px 0;
    background: linear-gradient(90deg, transparent, rgba(114, 145, 184, 0.36), transparent);
  }

  .pv-btn {
    width: 100%;
    border: 0;
    border-radius: 8px;
    padding: 13px;
    background: linear-gradient(90deg, #48bfff 0%, #1ca8ea 100%);
    color: #eaf7ff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    line-height: 1.1;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 12px 30px rgba(33, 164, 229, 0.26);
  }

  .pv-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    opacity: 0.94;
    box-shadow: 0 16px 32px rgba(33, 164, 229, 0.34);
  }

  .pv-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .pv-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    box-shadow: none;
  }

  .pv-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.45);
    border-top-color: #fff;
    border-radius: 50%;
    animation: pvSpin 0.72s linear infinite;
    vertical-align: middle;
  }

  @keyframes pvSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .pv-status {
    margin-top: 16px;
    border-radius: 8px;
    border: 1px solid rgba(248, 113, 113, 0.3);
    background: rgba(127, 42, 54, 0.16);
    color: #ff7388;
    padding: 11px 14px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pv-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  .pv-footer {
    margin-top: 20px;
    text-align: center;
    color: #7086a5;
    font-size: 13px;
  }

  .pv-footer a {
    color: #36c0ff;
    text-decoration: none;
    font-weight: 600;
  }

  .pv-footer a:hover {
    opacity: 0.75;
  }

  .pv-login-card {
    width: min(100%, 430px);
    padding: clamp(24px, 5vw, 34px) clamp(20px, 5vw, 40px) clamp(26px, 6vw, 34px);
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(249, 250, 255, 0.93) 100%);
    border: 1px solid rgba(255, 255, 255, 0.76);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.92),
      0 24px 56px rgba(153, 111, 209, 0.22);
    backdrop-filter: blur(10px);
  }

  .pv-login-badge {
    margin-left: auto;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    border: 1px solid rgba(211, 214, 224, 0.9);
    background: #f1f2f6;
    color: #31384b;
    display: grid;
    place-items: center;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  .pv-login-heading {
    margin: 10px 0 6px;
    text-align: center;
    color: #0f1d3e;
    font-size: clamp(40px, 7.6vw, 48px);
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.03em;
    position: relative;
    text-wrap: balance;
  }

  .pv-login-heading::after {
    content: none;
  }

  .pv-login-sub {
    margin-bottom: 22px;
    text-align: center;
    color: #55607b;
    font-size: 16px;
    line-height: 1.3;
    font-weight: 500;
  }

  .pv-login-role-switch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    margin-bottom: 18px;
    padding: 4px;
    border-radius: 999px;
    background: #d8dbe2;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
  }

  .pv-login-role-btn {
    min-height: 36px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #1e2741;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    text-transform: lowercase;
    cursor: pointer;
    transition: color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .pv-login-role-btn.is-active {
    background: linear-gradient(90deg, #9152f0 0%, #b84add 44%, #db428d 100%);
    color: #fff;
    box-shadow: 0 8px 16px rgba(145, 82, 240, 0.35);
  }

  .pv-login-form {
    display: grid;
    gap: 14px;
  }

  .pv-login-field {
    width: 100%;
  }

  .pv-login-input-shell {
    width: 100%;
    min-height: 50px;
    border-radius: 12px;
    border: 1px solid #cfd4df;
    background: #ffffff;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px 0 12px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .pv-login-input-shell:focus-within {
    border-color: rgba(165, 89, 247, 0.72);
    box-shadow: 0 0 0 3px rgba(165, 89, 247, 0.15);
  }

  .pv-login-lead {
    width: 18px;
    height: 18px;
    color: #98a1b2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pv-login-input {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #1f2b43;
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.2;
    padding: 11px 0;
    outline: none;
    -webkit-appearance: none;
  }

  .pv-login-input::placeholder {
    color: #8e98ac;
    font-weight: 500;
  }

  .pv-login-input-password {
    padding-right: 2px;
  }

  .pv-login-toggle {
    width: 22px;
    height: 22px;
    border: 0;
    background: transparent;
    color: #98a1b2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.2s;
  }

  .pv-login-toggle:hover {
    color: #6a7388;
  }

  .pv-login-btn {
    width: 100%;
    margin-top: 2px;
    min-height: 50px;
    border: 0;
    border-radius: 12px;
    padding: 12px;
    background: linear-gradient(90deg, #9e54f7 0%, #cc49c4 52%, #e74292 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 17px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.02em;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 12px 22px rgba(188, 72, 195, 0.32);
  }

  .pv-login-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 16px 26px rgba(188, 72, 195, 0.42);
  }

  .pv-login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    box-shadow: none;
  }

  .pv-login-status {
    margin-top: 14px;
    border-color: rgba(242, 79, 126, 0.32);
    background: rgba(242, 79, 126, 0.11);
    color: #cd3369;
  }

  .pv-login-footer {
    margin-top: 18px;
    text-align: center;
    color: #323f5a;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 500;
  }

  .pv-login-footer a {
    color: #8b4dff;
    text-decoration: none;
    font-weight: 700;
  }

  .pv-login-footer a:hover {
    opacity: 0.8;
  }

  @media (max-width: 640px) {
    #root {
      padding: 16px 12px;
    }

    .pv-logo-name {
      font-size: 14px;
    }

    .pv-logo-tag {
      font-size: 8px;
      letter-spacing: 0.16em;
    }

    .pv-heading {
      font-size: 20px;
    }

    .pv-sub {
      font-size: 13px;
    }

    .pv-input {
      font-size: 13px;
      padding-top: 11px;
      padding-bottom: 11px;
    }

    .pv-btn {
      font-size: 14px;
    }

    .pv-login-heading {
      font-size: clamp(32px, 11vw, 40px);
    }

    .pv-login-sub {
      font-size: 14px;
      margin-bottom: 16px;
    }

    .pv-login-role-btn {
      min-height: 34px;
      font-size: 13px;
    }

    .pv-login-input {
      font-size: 15px;
    }

    .pv-login-btn {
      min-height: 46px;
      font-size: 16px;
    }

    .pv-login-footer {
      font-size: 13px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pv-logo-rotor {
      animation: none;
    }
  }
`;

export function useAuthPageStyles() {
  useEffect(() => {
    const previous = document.getElementById(STYLE_ID);
    if (previous) {
      previous.remove();
    }

    const styleElement = document.createElement("style");
    styleElement.id = STYLE_ID;
    styleElement.textContent = AUTH_STYLES;
    document.head.appendChild(styleElement);

    return () => {
      styleElement.remove();
    };
  }, []);
}

type AuthPageBackgroundVariant = "darkGrid" | "pastel";

export function AuthPageBackground({ variant = "darkGrid" }: { variant?: AuthPageBackgroundVariant }) {
  const isPastel = variant === "pastel";
  return (
    <>
      <div className={`pv-bg${isPastel ? " pv-bg--pastel" : ""}`} />
      <div className={`pv-glow${isPastel ? " pv-glow--pastel" : ""}`} />
    </>
  );
}

export function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.978 9.978 0 012.034-3.534M6.53 6.53A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.994 9.994 0 01-4.072 5.273M15 12a3 3 0 01-4.243 2.757M9.88 9.88A3 3 0 0115 12M3 3l18 18" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V8a5 5 0 0110 0v3" />
      <rect x="4" y="11" width="16" height="10" rx="2" />
    </svg>
  );
}

export function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" d="M12 4v3" />
      <path strokeLinecap="round" d="M12 17v3" />
      <path strokeLinecap="round" d="M4 12h3" />
      <path strokeLinecap="round" d="M17 12h3" />
      <path strokeLinecap="round" d="m6.5 6.5 2.1 2.1" />
      <path strokeLinecap="round" d="m15.4 15.4 2.1 2.1" />
      <path strokeLinecap="round" d="m17.5 6.5-2.1 2.1" />
      <path strokeLinecap="round" d="m8.6 15.4-2.1 2.1" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
      />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19a4 4 0 00-8 0M12 12a4 4 0 100-8 4 4 0 000 8zM3 19h18" />
    </svg>
  );
}

export function PinevoxLogo() {
  return (
    <svg className="pv-logo-mark" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="38" rx="9" fill="#0ea5e9" opacity="0.15" />
      <g className="pv-logo-rotor">
        <polygon points="19,5 33,28 5,28" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="19,12 28,26 10,26" fill="#38bdf8" opacity="0.26" />
        <circle cx="19" cy="19" r="2.8" fill="#38bdf8" />
      </g>
    </svg>
  );
}
