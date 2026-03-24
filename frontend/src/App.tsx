/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useEffect, useMemo } from "react";

/* ─── TOKENS ─────────────────────────────────────────── */
const T = {
  bg: "var(--bg, #030c24)", surf: "var(--surf, #081a3d)", surf2: "var(--surf2, #0b224e)", surf3: "var(--surf3, #122d63)",
  border: "var(--border, rgba(70,130,220,0.28))", border2: "var(--border2, rgba(44,198,255,0.55))",
  cyan: "var(--cyan, #2cc6ff)", cyanD: "var(--cyanD, #1d8be8)", violet: "var(--violet, #8a7aff)",
  green: "var(--green, #26d6a1)", amber: "var(--amber, #ffc54d)", red: "var(--red, #ff6b9d)",
  text: "var(--text, #e9f4ff)", muted: "var(--muted, #8ea9d3)", muted2: "var(--muted2, #5a73a0)",
};

const THEME_VARS = {
  dark: {
    "--bg": "#030c24",
    "--surf": "#081a3d",
    "--surf2": "#0b224e",
    "--surf3": "#122d63",
    "--border": "rgba(70,130,220,0.28)",
    "--border2": "rgba(44,198,255,0.55)",
    "--cyan": "#2cc6ff",
    "--cyanD": "#1d8be8",
    "--violet": "#8a7aff",
    "--green": "#26d6a1",
    "--amber": "#ffc54d",
    "--red": "#ff6b9d",
    "--text": "#e9f4ff",
    "--muted": "#8ea9d3",
    "--muted2": "#5a73a0",
  },
  light: {
    "--bg": "#edf3ff",
    "--surf": "#ffffff",
    "--surf2": "#f4f8ff",
    "--surf3": "#e5edff",
    "--border": "rgba(36,84,158,0.20)",
    "--border2": "rgba(22,120,236,0.45)",
    "--cyan": "#0b7bff",
    "--cyanD": "#095fc8",
    "--violet": "#6d62e8",
    "--green": "#129b73",
    "--amber": "#c78100",
    "--red": "#d44f83",
    "--text": "#0e1d3a",
    "--muted": "#5974a0",
    "--muted2": "#8aa0c3",
  },
};

/* ─── GLOBAL STYLES ──────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:${T.bg};color:${T.text};font-family:'Space Grotesk',sans-serif;min-height:100vh}
  ::-webkit-scrollbar{width:6px;height:6px}
  ::-webkit-scrollbar-track{background:${T.surf}}
  ::-webkit-scrollbar-thumb{background:${T.muted2};border-radius:3px}
  ::-webkit-scrollbar-thumb:hover{background:${T.muted}}
  input,select{color:${T.text};background:${T.surf2};border:1px solid ${T.border};border-radius:8px;
    padding:9px 12px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;width:100%;
    transition:border-color .2s,box-shadow .2s}
  input:focus,select:focus{border-color:${T.cyan};box-shadow:0 0 0 3px rgba(44,198,255,.16)}
  input::placeholder{color:${T.muted}}
  select option{background:${T.surf2}}
  button{cursor:pointer}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes blobdrift{to{transform:translate(50px,30px)}}
  @keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
  @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 0 rgba(44,198,255,0)}50%{box-shadow:0 0 22px rgba(44,198,255,.28)}}
`;

/* ─── MOCK DATA ──────────────────────────────────────── */
const CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Peshawar","Multan","Faisalabad","Quetta"];
const CALL_TYPES = ["Incoming","Outgoing","Missed"];
const rnd = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pad = n => String(n).padStart(2,"0");
const fakeNum = () => `+92${rnd(300,399)}${rnd(1000000,9999999)}`;
const fakeDate = () => {
  const m=rnd(1,12),d=rnd(1,28);
  return `2024-${pad(m)}-${pad(d)} ${pad(rnd(8,22))}:${pad(rnd(0,59))}`;
};
const fmtDur = s => { const m=Math.floor(s/60); return `${pad(m)}:${pad(s%60)}`; };

const USERS = [
  {name:"Sarah Al-Rashidi",email:"sarah@pinevox.io",role:"admin",calls:1240,reports:34,grad:`linear-gradient(135deg,${T.cyan},${T.violet})`},
  {name:"Hamza Malik",email:"hamza@pinevox.io",role:"analyst",calls:860,reports:21,grad:`linear-gradient(135deg,${T.green},${T.cyan})`},
  {name:"Nadia Qureshi",email:"nadia@pinevox.io",role:"analyst",calls:543,reports:15,grad:`linear-gradient(135deg,${T.violet},${T.red})`},
  {name:"Omar Farooq",email:"omar@pinevox.io",role:"admin",calls:2100,reports:67,grad:`linear-gradient(135deg,${T.amber},#ff8c00)`},
  {name:"Zara Khan",email:"zara@pinevox.io",role:"analyst",calls:390,reports:9,grad:`linear-gradient(135deg,${T.red},${T.violet})`},
  {name:"Ali Hassan",email:"ali@pinevox.io",role:"analyst",calls:712,reports:18,grad:`linear-gradient(135deg,${T.green},#00a0ff)`},
];

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1kqnCdclcGpnaVWUXO8BH1BFQtbwVJInqHDji-unrwRc/edit?usp=sharing";
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1kqnCdclcGpnaVWUXO8BH1BFQtbwVJInqHDji-unrwRc/export?format=csv&gid=0";
const LOCAL_FALLBACK_CSV_URL = "/mock_cdr.csv";

const normHeader = h => h.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
const csvLine = line => {
  const out = [];
  let cur = "";
  let quote = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === "\"") {
      if (quote && line[i + 1] === "\"") { cur += "\""; i += 1; }
      else { quote = !quote; }
      continue;
    }
    if (ch === "," && !quote) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
};
const parseCsv = text => {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
  if (lines.length < 2) return [];
  const headers = csvLine(lines[0]).map(normHeader);
  return lines.slice(1).map(line => {
    const vals = csvLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = (vals[i] || "").trim(); });
    return row;
  });
};
const getCol = (row, keys) => {
  for (const k of keys) {
    if (row[k]) return row[k];
  }
  return "";
};
const parseDur = raw => {
  const v = String(raw || "").trim();
  if (!v) return 0;
  if (/^\d+$/.test(v)) return Number(v);
  const parts = v.split(":").map(n => Number(n));
  if (parts.length === 3 && parts.every(n => !Number.isNaN(n))) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2 && parts.every(n => !Number.isNaN(n))) return parts[0] * 60 + parts[1];
  const n = Number(v.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n) : 0;
};
const normType = raw => {
  const v = String(raw || "").toLowerCase();
  if (v === "true" || v === "1") return "Incoming";
  if (v === "false" || v === "0") return "Outgoing";
  if (v.includes("miss")) return "Missed";
  if (v.includes("in")) return "Incoming";
  if (v.includes("out")) return "Outgoing";
  return "Outgoing";
};
const normTime = raw => {
  const v = String(raw || "").trim();
  if (!v) return fakeDate();
  const s = v.replace("T", " ").replace("Z", "");
  return s.length > 16 ? s.slice(0, 16) : s;
};
const mapSheetRows = rows => (
  rows.map((row, i) => {
    const caller = getCol(row, ["caller", "caller_number", "callernumber", "caller_no", "calling_number", "from", "source"]);
    const receiver = getCol(row, ["receiver", "receiver_number", "receivernumber", "receiver_no", "called_number", "to", "destination"]);
    const city = getCol(row, ["city", "caller_city", "location_city"]) || CITIES[rnd(0, CITIES.length - 1)];
    const id = getCol(row, ["id", "cdr_id", "record_id"]) || i + 1;
    const type = normType(getCol(row, ["type", "call_type", "call_direction", "calldirection", "direction"]));
    const duration = parseDur(getCol(row, ["duration", "duration_sec", "duration_seconds", "seconds", "call_duration", "callduration"]));
    const datetime = normTime(getCol(row, ["datetime", "date_time", "timestamp", "date", "call_date", "time", "call_start_time", "callstarttime"]));

    return {
      id,
      caller: caller || fakeNum(),
      receiver: receiver || fakeNum(),
      type,
      duration,
      city,
      datetime,
    };
  }).filter(r => r.caller || r.receiver)
);
const loadCdrFromCsvUrl = async (url) => {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const txt = await resp.text();
    if (!txt || txt.trim().startsWith("<!DOCTYPE html")) return [];
    return mapSheetRows(parseCsv(txt));
  } catch {
    return [];
  }
};
const loadSheetCdrData = async () => loadCdrFromCsvUrl(GOOGLE_SHEET_CSV_URL);
const loadFallbackCdrData = async () => loadCdrFromCsvUrl(LOCAL_FALLBACK_CSV_URL);

const ENDPOINTS = [
  {method:"GET",path:"/cdr/records",desc:"Paginated CDR records",auth:true,
   body:`GET /api/v1/cdr/records?page=1&limit=20&city=Karachi&type=Outgoing\nAuthorization: Bearer <JWT_TOKEN>\n\nResponse 200:\n{\n  "page": 1,\n  "total": 2419,\n  "data": [{\n    "id": "CDR-001",\n    "caller": "+923001234567",\n    "receiver": "+923451234567",\n    "type": "Outgoing",\n    "duration": 342,\n    "city": "Karachi",\n    "datetime": "2024-06-15 14:32:00"\n  }]\n}`},
  {method:"GET",path:"/cdr/analytics/total-calls",desc:"Total call count",auth:true,
   body:`GET /api/v1/cdr/analytics/total-calls\n\nResponse 200:\n{\n  "total_calls": 48291,\n  "period": "2024-01-01 to 2024-12-31"\n}`},
  {method:"GET",path:"/cdr/analytics/call-type-distribution",desc:"Incoming/Outgoing/Missed split",auth:true,
   body:`GET /api/v1/cdr/analytics/call-type-distribution\n\nResponse 200:\n{\n  "incoming": 36,\n  "outgoing": 52,\n  "missed": 12,\n  "unit": "percent"\n}`},
  {method:"GET",path:"/cdr/analytics/top-callers",desc:"Top callers by volume",auth:true,
   body:`GET /api/v1/cdr/analytics/top-callers?limit=10\n\nResponse 200:\n{\n  "callers": [\n    { "number": "+923001234567", "call_count": 214 }\n  ]\n}`},
  {method:"POST",path:"/auth/login",desc:"Authenticate — returns JWT",auth:false,
   body:`POST /api/v1/auth/login\nContent-Type: application/json\n\n{\n  "email": "analyst@pinevox.io",\n  "password": "securepass123"\n}\n\nResponse 200:\n{\n  "token": "eyJhbGciOiJIUzI1NiIs...",\n  "role": "analyst",\n  "expires_in": 3600\n}`},
  {method:"POST",path:"/auth/register",desc:"Create new user (Admin only)",auth:true,
   body:`POST /api/v1/auth/register\nAuthorization: Bearer <ADMIN_JWT>\n\n{\n  "name": "New Analyst",\n  "email": "new@pinevox.io",\n  "password": "hashed_password",\n  "role": "analyst"\n}\n\nResponse 201:\n{\n  "message": "User created successfully",\n  "userId": "USR-088"\n}`},
];

/* ─── SMALL COMPONENTS ───────────────────────────────── */

const Tag = ({type}) => {
  const cfg = {
    Incoming:{bg:"rgba(38,214,161,.1)",color:T.green},
    Outgoing:{bg:"rgba(44,198,255,.1)",color:T.cyan},
    Missed:{bg:"rgba(244,63,94,.1)",color:T.red},
  };
  const c = cfg[type]||cfg.Outgoing;
  return (
    <span style={{
      padding:"3px 9px",borderRadius:6,fontSize:10,fontWeight:700,
      fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".04em",
      background:c.bg,color:c.color,
    }}>{type}</span>
  );
};

const StatCard = ({icon,value,label,delta,deltaUp,accent}) => (
  <div style={{
    background:T.surf,border:`1px solid ${T.border}`,borderRadius:14,padding:20,
    transition:"border-color .2s,transform .2s",animation:"fadeUp .5s ease both",
    position:"relative",overflow:"hidden",
  }}
  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=T.border2}}
  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=T.border}}
  >
    <div style={{
      width:36,height:36,borderRadius:9,marginBottom:14,fontSize:18,
      display:"grid",placeItems:"center",
      background:"rgba(44,198,255,.14)",color:accent,
    }}>{icon}</div>
    <div style={{fontSize:28,fontWeight:800,lineHeight:1,marginBottom:4}}>{value}</div>
    <div style={{fontSize:11,color:T.muted,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>{label}</div>
    <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",marginTop:8,color:deltaUp?T.green:T.red}}>
      {deltaUp?"▲":"▼"} {delta}
    </div>
  </div>
);

const Card = ({title,badge,children,style={},rawBadge=false}) => (
  <div style={{background:T.surf,border:`1px solid ${T.border}`,borderRadius:14,padding:22,...style}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
      <div style={{fontSize:13,fontWeight:700,letterSpacing:".04em"}}>{title}</div>
      {badge && (
        rawBadge ? badge : (
          <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",padding:"3px 9px",borderRadius:6,background:"rgba(44,198,255,.1)",color:T.cyan}}>
            {badge}
          </span>
        )
      )}
    </div>
    {children}
  </div>
);

const BtnPrimary = ({children,onClick,style={}}) => (
  <button onClick={onClick} style={{
    padding:"10px 22px",background:`linear-gradient(135deg,${T.cyan},${T.cyanD})`,
    border:"none",borderRadius:10,color:"#05080f",fontFamily:"'Space Grotesk',sans-serif",
    fontSize:13,fontWeight:800,letterSpacing:".04em",
    boxShadow:"0 0 24px rgba(44,198,255,.2)",transition:"transform .15s,box-shadow .15s",...style
  }}
  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 0 36px rgba(44,198,255,.38)"}}
  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 0 24px rgba(44,198,255,.2)"}}
  >{children}</button>
);

const BtnSm = ({children,onClick}) => (
  <button onClick={onClick} style={{
    padding:"8px 16px",background:T.surf,border:`1px solid ${T.border2}`,
    borderRadius:8,color:T.cyan,fontFamily:"'Space Grotesk',sans-serif",fontSize:12,fontWeight:700,
    transition:"background .2s",
  }}
  onMouseEnter={e=>e.currentTarget.style.background="rgba(44,198,255,.1)"}
  onMouseLeave={e=>e.currentTarget.style.background=T.surf}
  >{children}</button>
);

const ThemeSparkIcon = ({size=14}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2.2"/>
    <path d="M12 4.6v2.1M12 17.3v2.1M4.6 12h2.1M17.3 12h2.1"/>
    <path d="M6.9 6.9l1.5 1.5M15.6 15.6l1.5 1.5M17.1 6.9l-1.5 1.5M8.4 15.6l-1.5 1.5"/>
  </svg>
);

/* ─── TOAST ──────────────────────────────────────────── */
const Toast = ({msg,visible}) => (
  <div style={{
    position:"fixed",bottom:28,right:28,zIndex:9999,
    background:T.surf,border:"1px solid rgba(38,214,161,.3)",
    borderRadius:12,padding:"14px 18px",
    display:"flex",alignItems:"center",gap:10,
    boxShadow:"0 8px 32px rgba(0,0,0,.5)",fontSize:13,
    opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(12px)",
    transition:"opacity .3s,transform .3s",pointerEvents:"none",
  }}>
    <div style={{width:8,height:8,borderRadius:"50%",background:T.green,flexShrink:0,animation:"pulse 2s infinite"}}/>
    {msg}
  </div>
);

/* ─── LOGIN PAGE ─────────────────────────────────────── */
const LoginPage = ({onLogin,theme,onToggleTheme}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = () => {
    if (!email) { setError("Email is required"); return; }
    if (!password) { setError("Password is required"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => onLogin("analyst"), 350);
    }, 1800);
  };

  return (
    <div style={loginS.root}>
      <div style={{ ...loginS.blob, top: "-100px", left: "-80px", background: "radial-gradient(circle, rgba(44,198,255,0.2) 0%, transparent 70%)" }} />
      <div style={{ ...loginS.blob, bottom: "-80px", right: "-60px", background: "radial-gradient(circle, rgba(138,122,255,0.16) 0%, transparent 70%)", width: 450, height: 450 }} />
      <div style={{ ...loginS.blob, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(38,214,161,0.1) 0%, transparent 70%)", width: 600, height: 600 }} />

      <div style={{ ...loginS.card, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease" }}>

        <button
          onClick={onToggleTheme}
          style={{
            ...loginS.themeBtn,
            background: theme === "dark" ? "#ffffff" : "var(--surf2, #0b224e)",
            border: theme === "dark" ? "2px solid #202b44" : "1px solid var(--border2, rgba(44,198,255,0.55))",
          }}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <span style={{display:"grid",placeItems:"center",color:"var(--cyan, #2cc6ff)"}} aria-hidden="true">
            <ThemeSparkIcon size={14}/>
          </span>
        </button>

        <div style={loginS.titleBlock}>
          <h1 style={loginS.title}>Welcome Back</h1>
        </div>

        <div style={loginS.inputWrap(focusedField === "email", false)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={focusedField === "email" ? "var(--cyan, #2cc6ff)" : "var(--muted, #8ea9d3)"} strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
          </svg>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            placeholder="Email address"
            style={loginS.input}
          />
        </div>

        <div style={loginS.inputWrap(focusedField === "password", !!error)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={error ? "var(--red, #ff6b9d)" : focusedField === "password" ? "var(--cyan, #2cc6ff)" : "var(--muted, #8ea9d3)"} strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            placeholder="Password"
            style={loginS.input}
          />
          <span onClick={() => setShowPassword(!showPassword)} style={loginS.eyeBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted, #8ea9d3)" strokeWidth="2">
              {showPassword
                ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
              }
            </svg>
          </span>
        </div>

        {error && (
          <div style={loginS.errorBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--red, #ff6b9d)">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2"/><circle cx="12" cy="17" r="1" fill="white"/>
            </svg>
            <div>
              <div style={loginS.errorTitle}>Login Error</div>
              <div style={loginS.errorMsg}>{error}</div>
            </div>
          </div>
        )}

        <button onClick={handleLogin} disabled={loading || success} style={{ ...loginS.loginBtn, ...(success ? loginS.loginBtnSuccess : {}) }}>
          {success ? (
            <span style={loginS.btnRow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Access Granted
            </span>
          ) : loading ? (
            <span style={loginS.btnRow}><span style={loginS.spinner} /> Signing in…</span>
          ) : "Login"}
        </button>

        <p style={loginS.signupText}>
          Don&apos;t have an account?{" "}
          <span style={loginS.signupLink}>Sign Up</span>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
        input:focus { outline: none; }
        button:focus { outline: none; }
        input::placeholder { color: var(--muted, #8ea9d3); }
        @keyframes errorSlide { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

const loginS = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, var(--bg, #030c24) 0%, var(--surf2, #0b224e) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Space Grotesk', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    width: 500, height: 500,
    borderRadius: "50%",
    pointerEvents: "none",
  },
  card: {
    width: 370,
    background: "var(--surf, #081a3d)",
    borderRadius: 24,
    padding: "34px 30px 28px",
    boxShadow: "0 8px 32px rgba(44,198,255,0.18), 0 2px 8px rgba(0,0,0,0.24)",
    border: "1px solid var(--border, rgba(70,130,220,0.28))",
    position: "relative",
    zIndex: 1,
  },
  themeBtn: {
    position: "absolute",
    top: 20, right: 20,
    width: 34, height: 34,
    borderRadius: "50%",
    background: "var(--surf2, #0b224e)",
    display: "grid", placeItems: "center",
    cursor: "pointer",
    border: "1px solid var(--border2, rgba(44,198,255,0.55))",
    outline: "none",
  },
  titleBlock: {
    textAlign: "center",
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: "var(--text, #e9f4ff)",
    letterSpacing: "-0.02em",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "var(--muted, #8ea9d3)",
  },
  roleWrap: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    background: "var(--surf2, #0b224e)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    height: 46,
  },
  roleSlider: {
    position: "absolute",
    top: 4,
    width: "calc(50% - 6px)",
    height: "calc(100% - 8px)",
    background: "linear-gradient(135deg, var(--cyan, #2cc6ff), var(--cyanD, #1d8be8))",
    borderRadius: 9,
    transition: "left 0.28s cubic-bezier(0.4,0,0.2,1)",
    boxShadow: "0 2px 10px rgba(44,198,255,0.35)",
  },
  roleBtn: {
    position: "relative",
    zIndex: 1,
    background: "none",
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Space Grotesk', sans-serif",
    cursor: "pointer",
    borderRadius: 9,
    transition: "color 0.25s ease",
    textTransform: "capitalize",
  },
  inputWrap: (focused, isErr) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 14px",
    border: `1.5px solid ${isErr ? "var(--red, #ff6b9d)" : focused ? "var(--cyan, #2cc6ff)" : "var(--border, rgba(70,130,220,0.28))"}`,
    borderRadius: 12,
    background: isErr ? "rgba(255,107,157,0.08)" : focused ? "var(--surf3, #122d63)" : "var(--surf2, #0b224e)",
    marginBottom: 12,
    height: 50,
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    boxShadow: focused && !isErr ? "0 0 0 3px rgba(44,198,255,0.14)" : isErr ? "0 0 0 3px rgba(255,107,157,0.14)" : "none",
  }),
  input: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: 14,
    color: "var(--text, #e9f4ff)",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  eyeBtn: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "4px",
  },
  errorBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "12px 14px",
    background: "rgba(255,107,157,0.1)",
    border: "1px solid rgba(255,107,157,0.3)",
    borderRadius: 10,
    marginBottom: 16,
    animation: "errorSlide 0.3s ease",
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--red, #ff6b9d)",
    marginBottom: 2,
  },
  errorMsg: {
    fontSize: 12,
    color: "var(--red, #ff6b9d)",
  },
  loginBtn: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, var(--cyan, #2cc6ff) 0%, var(--cyanD, #1d8be8) 55%, var(--violet, #8a7aff) 100%)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    cursor: "pointer",
    boxShadow: "0 4px 18px rgba(44,198,255,0.28)",
    transition: "all 0.25s ease",
    marginBottom: 20,
  },
  loginBtnSuccess: {
    background: "linear-gradient(135deg, #10b981, #34d399)",
    boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
  },
  btnRow: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  },
  spinner: {
    width: 15, height: 15,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  signupText: {
    textAlign: "center",
    fontSize: 13,
    color: "var(--muted, #8ea9d3)",
  },
  signupLink: {
    color: "var(--cyan, #2cc6ff)",
    fontWeight: 600,
    cursor: "pointer",
  },
};

/* ─── TOPBAR ─────────────────────────────────────────── */
const Topbar = ({role,theme,onToggleTheme}) => {
  return (
    <div style={{
      display:"flex",alignItems:"center",padding:"0 28px",height:56,
      borderBottom:`1px solid ${T.border}`,background:T.surf,
      backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:100,gap:20,
    }}>
      <span style={{fontSize:12,fontWeight:600,color:T.muted,letterSpacing:".06em"}}>telecom-intelligence-platform</span>

      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:14}}>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
          style={{
            width:34,
            height:32,
            borderRadius:8,
            border: theme === "dark" ? "2px solid #202b44" : `1px solid ${T.border2}`,
            background: theme === "dark" ? "#ffffff" : T.surf,
            color:T.cyan,
            fontFamily:"'Space Grotesk',sans-serif",
            fontSize:16,
            fontWeight:600,
            display:"grid",
            placeItems:"center",
            transition:"all .2s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.cyan;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=theme === "dark" ? "#202b44" : T.border2;}}
        >
          <ThemeSparkIcon size={14}/>
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px 6px 6px",borderRadius:24,background:T.surf,border:`1px solid ${T.border}`}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${T.cyan},${T.violet})`,display:"grid",placeItems:"center",fontSize:11,fontWeight:700,color:"#05080f"}}>
            {role==="admin"?"A":"AN"}
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:600}}>{role==="admin"?"Admin User":"Analyst User"}</div>
            <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── SIDEBAR ────────────────────────────────────────── */
const NAV = [
  {id:"dashboard",icon:"▦",label:"Dashboard",section:"Analytics"},
  {id:"users",icon:"⚇",label:"Users",section:"Management"},
  {id:"settings",icon:"⚙",label:"Settings",section:"Management"},
  {id:"api",icon:"⌥",label:"API Reference",section:"Management"},
];

const Sidebar = ({page,setPage,role,onLogout}) => {
  const sections = [...new Set(NAV.map(n=>n.section))];
  return (
    <aside style={{borderRight:`1px solid ${T.border}`,padding:"20px 0 0",background:T.surf2,display:"flex",flexDirection:"column",minHeight:0}}>
      <div style={{flex:1,overflowY:"auto",paddingBottom:12}}>
        {sections.map(sec=>(
          <div key={sec} style={{padding:"0 16px",marginBottom:24}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".12em",color:T.muted,textTransform:"uppercase",padding:"0 8px",marginBottom:8}}>{sec}</div>
            {NAV.filter(n=>n.section===sec&&(!n.adminOnly||role==="admin")).map(n=>(
              <div key={n.id} onClick={()=>setPage(n.id)} style={{
                display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,
                cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:2,
                color:page===n.id?T.cyan:T.muted,
                background:page===n.id?"rgba(44,198,255,.14)":"transparent",
                border:page===n.id?`1px solid rgba(44,198,255,.35)`:"1px solid transparent",
                transition:"all .18s",
              }}
              onMouseEnter={e=>{if(page!==n.id){e.currentTarget.style.background="rgba(44,198,255,.1)";e.currentTarget.style.color=T.cyan}}}
              onMouseLeave={e=>{if(page!==n.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.muted}}}
              >
                <span style={{fontSize:14}}>{n.icon}</span>
                {n.label}
                {n.badge&&<span style={{marginLeft:"auto",padding:"2px 7px",borderRadius:8,background:"rgba(44,198,255,.12)",color:T.cyan,fontSize:10,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{n.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{padding:16,display:"flex",flexDirection:"column",gap:10,borderTop:`1px solid ${T.border}`}}>
        <button
          onClick={onLogout}
          style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            gap:8,
            width:"100%",
            padding:"10px 12px",
            borderRadius:10,
            border:`1px solid ${T.border2}`,
            background:T.surf,
            color:T.cyan,
            fontFamily:"'Space Grotesk',sans-serif",
            fontSize:13,
            fontWeight:700,
            transition:"all .2s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.red;e.currentTarget.style.color=T.red;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border2;e.currentTarget.style.color=T.cyan;}}
        >
          ⎋ Logout
        </button>
        <div style={{padding:"10px 12px",borderRadius:10,background:"rgba(38,214,161,.06)",border:"1px solid rgba(38,214,161,.12)",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>
          <div style={{color:T.muted,marginBottom:4}}>Backend Status</div>
          <div style={{color:T.green}}>✓ All systems operational</div>
          <div style={{marginTop:6,color:T.muted}}>JWT Auth · REST API · v2.1.4</div>
        </div>
      </div>
    </aside>
  );
};

/* ─── DASHBOARD PAGE ─────────────────────────────────── */
const Dashboard = ({setPage,showToast,cdrData}) => {
  const [cityFilter, setCityFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [logsPage, setLogsPage] = useState(1);

  const nameSeeds = ["Alice","Maya","Noah","Liam","Ava","Ethan","Zoya","Aiden","Sofia","Mason"];
  const surnameSeeds = ["Johnson","Walker","Singh","Khan","Ali","Scott","Brown","Smith","Clark","Taylor"];
  const parsed = useMemo(() => (
    cdrData.map((r, i) => {
      const dt = new Date(String(r.datetime || "").replace(" ", "T"));
      const date = Number.isNaN(dt.getTime()) ? new Date() : dt;
      const day = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
      const syntheticCost = Number(((r.duration / 60) * 0.92 + ((i % 6) + 1) * 0.19).toFixed(2));
      const syntheticSuccess = i % 11 !== 0;
      const callerName = `${nameSeeds[i % nameSeeds.length]} ${surnameSeeds[(i * 3) % surnameSeeds.length]}`;
      return { ...r, _date: date, _day: day, _cost: syntheticCost, _success: syntheticSuccess, _callerName: callerName };
    })
  ), [cdrData]);

  const cityOptions = useMemo(() => (["all", ...Array.from(new Set(parsed.map(r => r.city))).sort()]), [parsed]);
  const filtered = useMemo(() => (
    parsed.filter((r) => {
      if (cityFilter !== "all" && r.city !== cityFilter) return false;
      if (fromDate && r._day < fromDate) return false;
      if (toDate && r._day > toDate) return false;
      return true;
    })
  ), [parsed, cityFilter, fromDate, toDate]);

  useEffect(() => { setLogsPage(1); }, [cityFilter, fromDate, toDate, rowsPerPage]);

  const totalCalls = filtered.length;
  const totalDuration = filtered.reduce((a, r) => a + (r.duration || 0), 0);
  const totalCost = filtered.reduce((a, r) => a + (r._cost || 0), 0);
  const avgDuration = totalCalls ? Math.round(totalDuration / totalCalls) : 0;
  const successfulCalls = filtered.filter(r => r._success).length;
  const failedCalls = totalCalls - successfulCalls;
  const longestCall = filtered.length ? Math.max(...filtered.map(r => r.duration || 0)) : 0;
  const shortestCall = filtered.length ? Math.min(...filtered.map(r => r.duration || 0)) : 0;

  const dailyMap = {};
  filtered.forEach((r) => { dailyMap[r._day] = (dailyMap[r._day] || 0) + 1; });
  const [peakDay, peakCount] = Object.entries(dailyMap).sort((a,b)=>b[1]-a[1])[0] || ["-", 0];

  const durationBars = [
    { label: "Shortest", value: shortestCall, color: T.cyan },
    { label: "Average", value: avgDuration, color: T.violet },
    { label: "Longest", value: longestCall, color: T.amber },
  ];
  const maxDurationBar = Math.max(1, ...durationBars.map(x => x.value));

  const cityCostMap = {};
  filtered.forEach((r) => { cityCostMap[r.city] = (cityCostMap[r.city] || 0) + r._cost; });
  const costBars = Object.entries(cityCostMap)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5)
    .map(([city, cost], i) => ({ city, cost, color: [T.cyan, T.green, T.violet, T.amber, T.red][i] }));
  const maxCostBar = Math.max(1, ...costBars.map(x => x.cost));

  const activityHours = Array(24).fill(0);
  filtered.forEach((r) => { activityHours[r._date.getHours()] += 1; });
  const timelineX = Array.from({length:12},(_,i)=>i*2);
  const timelineY = timelineX.map(h => activityHours[h]);
  const maxTimeline = Math.max(1, ...timelineY);
  const timelinePoints = timelineY
    .map((v,i) => `${16 + i * 24},${82 - Math.round((v / maxTimeline) * 52)}`)
    .join(" ");

  const cityCountMap = {};
  filtered.forEach((r) => { cityCountMap[r.city] = (cityCountMap[r.city] || 0) + 1; });
  const citySlicesRaw = Object.entries(cityCountMap).sort((a,b)=>b[1]-a[1]);
  const topCitySlices = citySlicesRaw.slice(0,5);
  const otherCount = citySlicesRaw.slice(5).reduce((a,[,n])=>a+n,0);
  const citySlices = [...topCitySlices, ...(otherCount > 0 ? [["Others", otherCount]] : [])]
    .map(([city, count], i) => ({ city, count, color: [T.cyan, T.green, T.violet, T.amber, T.red, "#5be6d0"][i] }));
  const cityTotal = citySlices.reduce((a, s) => a + s.count, 0) || 1;
  const donutCirc = 2 * Math.PI * 32;
  let dashOffsetAcc = 0;

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  useEffect(() => { setLogsPage(p => Math.min(p, totalPages)); }, [totalPages]);
  const rows = filtered.slice((logsPage - 1) * rowsPerPage, logsPage * rowsPerPage);
  const rangeStart = totalCalls ? (logsPage - 1) * rowsPerPage + 1 : 0;
  const rangeEnd = Math.min(logsPage * rowsPerPage, totalCalls);

  const fmtMoney = (n) => `£${Number(n || 0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  const fmtSecs = (s) => `${Math.floor((s || 0)/60)}m ${pad((s || 0)%60)}s`;

  const panel = {
    background:T.surf,
    border:`1px solid ${T.border}`,
    borderRadius:12,
  };
  const filterUiFont = "'Space Grotesk', sans-serif";

  return (
    <div style={{animation:"fadeUp .35s ease both"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{fontSize:14,fontWeight:700,letterSpacing:".05em"}}>Welcome</div>
        <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>Realtime View</div>
      </div>

      <div style={{...panel,padding:"10px 12px",marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:6}}>
          <div style={{display:"grid",gridTemplateColumns:"2.1fr 1.2fr 1.2fr auto",gap:8,alignItems:"end",flex:1}}>
            <div>
              <div style={{fontSize:10,color:T.muted,marginBottom:5,fontWeight:700,letterSpacing:".06em",fontFamily:filterUiFont}}>City</div>
              <select
                value={cityFilter}
                onChange={(e)=>setCityFilter(e.target.value)}
                style={{width:"100%",height:40,padding:"0 12px",borderRadius:10,border:`1px solid ${T.border2}`,background:T.surf2,color:T.cyan,fontSize:14,fontWeight:700,fontFamily:filterUiFont}}
              >
                {cityOptions.map(c => <option key={c} value={c}>{c === "all" ? "All Cities" : c}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:T.muted,marginBottom:5,fontWeight:700,letterSpacing:".06em",fontFamily:filterUiFont}}>From</div>
              <input
                type="date"
                value={fromDate}
                onChange={(e)=>setFromDate(e.target.value)}
                style={{height:40,padding:"0 12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.surf2,color:T.text,fontSize:14,fontWeight:600,fontFamily:filterUiFont}}
              />
            </div>
            <div>
              <div style={{fontSize:10,color:T.muted,marginBottom:5,fontWeight:700,letterSpacing:".06em",fontFamily:filterUiFont}}>To</div>
              <input
                type="date"
                value={toDate}
                onChange={(e)=>setToDate(e.target.value)}
                style={{height:40,padding:"0 12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.surf2,color:T.text,fontSize:14,fontWeight:600,fontFamily:filterUiFont}}
              />
            </div>
            <button
              onClick={() => { setCityFilter("all"); setFromDate(""); setToDate(""); }}
              style={{height:40,padding:"0 14px",borderRadius:10,border:`1px solid ${T.border2}`,background:"rgba(44,198,255,.08)",color:T.cyan,fontSize:13,fontWeight:700,whiteSpace:"nowrap",fontFamily:filterUiFont}}
            >
              Reset Filters
            </button>
          </div>
          <div style={{fontSize:10,color:T.muted,fontFamily:filterUiFont,paddingTop:2,whiteSpace:"nowrap"}}>
            {totalCalls} records in range
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:10,marginBottom:10}}>
        {[
          {label:"Total Calls", value: totalCalls, color:T.cyan},
          {label:"Total Call Cost", value: fmtMoney(totalCost), color:T.green},
          {label:"Average Call Duration", value: `${Math.round(avgDuration)}s`, color:T.violet},
          {label:"Total Successful Calls", value: successfulCalls, color:T.green},
          {label:"Total Failed Calls", value: failedCalls, color:T.red},
        ].map((k)=>(
          <div key={k.label} style={{...panel,padding:"10px 12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,color:T.muted,fontSize:10,marginBottom:10}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:k.color,display:"inline-block"}}/>
              {k.label}
            </div>
            <div style={{fontSize:26,fontWeight:800,lineHeight:1,color:T.text}}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.45fr",gap:10,marginBottom:10}}>
        <div style={{...panel,padding:"10px 12px"}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Call Duration Analytics</div>
          <div style={{height:120,display:"flex",alignItems:"flex-end",justifyContent:"space-around",gap:10,padding:"0 8px 6px"}}>
            {durationBars.map((b)=>(
              <div key={b.label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flex:1}}>
                <div style={{width:"75%",height:Math.max(10,Math.round((b.value/maxDurationBar)*96)),background:b.color,borderRadius:6}}/>
                <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{...panel,padding:"10px 12px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div style={{fontSize:13,fontWeight:700}}>Call Cost Analysis</div>
            <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>Avg Cost / Call</div>
          </div>
          <div style={{height:120,display:"flex",alignItems:"flex-end",gap:8,padding:"0 8px 6px"}}>
            {costBars.map((b)=>(
              <div key={b.city} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flex:1}}>
                <div style={{width:"100%",height:Math.max(8,Math.round((b.cost/maxCostBar)*96)),background:b.color,borderRadius:4}}/>
                <div style={{fontSize:8,color:T.muted,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{b.city}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{...panel,padding:"10px 12px"}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Call Activity Timeline</div>
          <svg width="100%" height="120" viewBox="0 0 290 110" preserveAspectRatio="none">
            {[18,34,50,66,82].map(y => <line key={y} x1="12" y1={y} x2="280" y2={y} stroke={T.border} strokeWidth="1"/>)}
            <polyline points={timelinePoints} fill="none" stroke={T.cyan} strokeWidth="2.2"/>
            {timelinePoints.split(" ").map((pt, i) => {
              const [x,y] = pt.split(",");
              return <circle key={i} cx={x} cy={y} r="2.1" fill={T.cyan}/>;
            })}
            {timelineX.map((h,i)=><text key={h} x={16 + i*24} y="102" fill={T.muted} fontSize="8" textAnchor="middle">{h}</text>)}
          </svg>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10,marginBottom:10}}>
        <div style={{display:"grid",gap:8}}>
          {[
            {label:"Longest Call", value:fmtSecs(longestCall), sub:"Highest call duration", icon:"✆", color:T.cyan},
            {label:"Shortest Call", value:fmtSecs(shortestCall), sub:"Minimum connected call", icon:"⎋", color:T.green},
            {label:"Daily Activity", value:peakCount, sub:`Calls on ${peakDay}`, icon:"▣", color:T.amber},
          ].map((x)=>(
            <div key={x.label} style={{...panel,padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:9,color:T.muted,marginBottom:6}}>{x.label}</div>
                <div style={{fontSize:24,fontWeight:800,lineHeight:1,marginBottom:6}}>{x.value}</div>
                <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{x.sub}</div>
              </div>
              <div style={{width:20,height:20,borderRadius:6,background:"rgba(44,198,255,.14)",color:x.color,fontSize:12,display:"grid",placeItems:"center"}}>{x.icon}</div>
            </div>
          ))}
        </div>

        <div style={{...panel,padding:"10px 12px"}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Calls by City</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="32" fill="none" stroke={T.surf3} strokeWidth="11"/>
              {citySlices.map((s) => {
                const seg = (s.count / cityTotal) * donutCirc;
                const node = (
                  <circle
                    key={s.city}
                    cx="50"
                    cy="50"
                    r="32"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="11"
                    strokeDasharray={`${seg} ${donutCirc - seg}`}
                    strokeDashoffset={dashOffsetAcc}
                    transform="rotate(-90 50 50)"
                  />
                );
                dashOffsetAcc -= seg;
                return node;
              })}
            </svg>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {citySlices.map((s)=>(
              <div key={s.city} style={{display:"flex",alignItems:"center",gap:6,fontSize:9,color:T.muted}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:s.color,display:"inline-block"}}/>
                <span style={{flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.city}</span>
                <span style={{color:T.text,fontFamily:"'JetBrains Mono',monospace"}}>{Math.round((s.count/cityTotal)*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{...panel,padding:"10px 12px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div>
            <div style={{fontSize:13,fontWeight:700}}>Recent Call Logs</div>
            <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>Showing {rangeStart}-{rangeEnd} of {totalCalls}</div>
          </div>
          <div style={cdrPgBarStyle}>
            <span style={cdrPgLabelStyle}>Rows</span>
            <select value={rowsPerPage} onChange={(e)=>setRowsPerPage(Number(e.target.value))} style={cdrRowsSelectStyle}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <button onClick={()=>setLogsPage(p=>Math.max(1,p-1))} disabled={logsPage===1} style={cdrPgActionStyle(logsPage===1,"default")}>Previous</button>
            <span style={cdrPgPageStyle}>Page {logsPage} / {totalPages}</span>
            <button onClick={()=>setLogsPage(p=>Math.min(totalPages,p+1))} disabled={logsPage===totalPages} style={cdrPgActionStyle(logsPage===totalPages,"next")}>Next</button>
          </div>
        </div>

        <div style={{border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:T.surf3}}>
                {["Caller Name","Caller Number","Receiver Number","City","Duration","Cost","Start Time"].map((h)=>(
                  <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:9,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:T.muted,borderBottom:`1px solid ${T.border}`}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i)=>(
                <tr key={`${r.id}-${i}`} onMouseEnter={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="rgba(44,198,255,.04)")} onMouseLeave={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="transparent")}>
                  <td style={tdStyle}>{r._callerName}</td>
                  <td style={tdStyle}>{r.caller}</td>
                  <td style={tdStyle}>{r.receiver}</td>
                  <td style={tdStyle}>{r.city}</td>
                  <td style={tdStyle}>{fmtSecs(r.duration || 0)}</td>
                  <td style={tdStyle}>{fmtMoney(r._cost || 0)}</td>
                  <td style={tdStyle}>{String(r.datetime || "").replace("T"," ").replace("Z","")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ─── TABLE COMPONENT ────────────────────────────────── */
const TableGrid = ({rows,showIndex=true,startIdx=0}) => (
  <div style={{border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead>
        <tr style={{background:T.surf3}}>
          {showIndex&&<th style={thStyle}>#</th>}
          <th style={thStyle}>Caller</th>
          <th style={thStyle}>Receiver</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Duration</th>
          <th style={thStyle}>City</th>
          <th style={thStyle}>Date & Time</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r,i)=>(
          <tr key={r.id}
            onMouseEnter={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="rgba(44,198,255,.03)")}
            onMouseLeave={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="transparent")}
          >
            {showIndex&&<td style={tdStyle}><span style={{color:T.muted,fontSize:11}}>{startIdx+i+1}</span></td>}
            <td style={tdStyle}>{r.caller}</td>
            <td style={tdStyle}>{r.receiver}</td>
            <td style={tdStyle}><Tag type={r.type}/></td>
            <td style={{...tdStyle,color:T.muted}}>{fmtDur(r.duration)}</td>
            <td style={tdStyle}>{r.city}</td>
            <td style={tdStyle}>{r.datetime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const thStyle={padding:"12px 16px",textAlign:"left",fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:T.muted,borderBottom:`1px solid ${T.border}`};
const tdStyle={padding:"12px 16px",fontSize:12,fontFamily:"'JetBrains Mono',monospace",borderBottom:`1px solid rgba(44,198,255,.04)`,transition:"background .15s"};
const dashPgBtnStyle = disabled => ({
  width:28,
  height:28,
  borderRadius:8,
  border:`1px solid ${disabled ? T.border : T.border2}`,
  background:disabled ? T.surf3 : T.surf,
  color:disabled ? T.muted2 : T.cyan,
  fontFamily:"'JetBrains Mono',monospace",
  fontSize:12,
  display:"grid",
  placeItems:"center",
  cursor:disabled ? "not-allowed" : "pointer",
  transition:"all .2s",
});

/* ─── CDR PAGE ───────────────────────────────────────── */
const CDRPage = ({showToast,cdrData}) => {
  const [filters,setFilters] = useState({type:"",city:""});
  const [page,setPage] = useState(1);
  const [rowsPerPage,setRowsPerPage] = useState(10);

  const filtered = useMemo(()=>cdrData.filter(r=>{
    const tm=!filters.type||r.type===filters.type;
    const cm=!filters.city||r.city.toLowerCase().includes(filters.city.toLowerCase());
    return tm&&cm;
  }),[cdrData, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/rowsPerPage));
  const rows = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);
  useEffect(() => {
    setPage(p => Math.min(p, totalPages));
  }, [totalPages]);

  const apply = () => { setPage(1); showToast(`Filter applied · ${filtered.length} records found`); };

  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <div style={{fontSize:24,fontWeight:800}}>CDR Records</div>
          <div style={{color:T.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginTop:4}}>// Call Detail Records — Paginated API response</div>
          <div style={{color:T.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:10,marginTop:6}}>
            Dataset: <a href={GOOGLE_SHEET_URL} target="_blank" rel="noreferrer" style={{color:T.cyan}}>Google Sheet</a>
          </div>
        </div>
        <BtnSm onClick={()=>window.open(GOOGLE_SHEET_URL,"_blank","noopener,noreferrer")}>Open Google Sheet</BtnSm>
      </div>

      {/* Filters */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:12,marginBottom:20,alignItems:"end"}}>
        <div>
          <label style={labelStyle}>Call Type</label>
          <select value={filters.type} onChange={e=>setFilters(f=>({...f,type:e.target.value}))}>
            <option value="">All Types</option>
            {CALL_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>City</label>
          <input value={filters.city} onChange={e=>setFilters(f=>({...f,city:e.target.value}))} placeholder="e.g. Karachi"/>
        </div>
        <div>
          <label style={labelStyle}>Records found</label>
          <div style={{padding:"9px 12px",background:T.surf,border:`1px solid ${T.border}`,borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.green}}>{filtered.length} records</div>
        </div>
        <BtnPrimary onClick={apply} style={{padding:"9px 20px",alignSelf:"flex-end"}}>Apply Filter</BtnPrimary>
      </div>

      <TableGrid rows={rows} showIndex startIdx={(page-1)*rowsPerPage}/>

      {/* Pagination */}
      <div style={{display:"flex",marginTop:16,justifyContent:"flex-end"}}>
        <div style={cdrPgBarStyle}>
          <span style={cdrPgLabelStyle}>Rows</span>
          <select
            value={rowsPerPage}
            onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            style={cdrRowsSelectStyle}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <button
            onClick={()=>setPage(p=>Math.max(1,p-1))}
            disabled={page === 1}
            style={cdrPgActionStyle(page === 1, "default")}
          >
            Previous
          </button>

          <span style={cdrPgPageStyle}>Page {page} / {totalPages}</span>

          <button
            onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
            disabled={page === totalPages}
            style={cdrPgActionStyle(page === totalPages, "next")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
const labelStyle={display:"block",fontSize:10,fontWeight:700,letterSpacing:".1em",color:T.muted,textTransform:"uppercase",marginBottom:6};
const cdrPgBarStyle = {
  display:"flex",
  alignItems:"center",
  gap:8,
  padding:"7px 10px",
  borderRadius:8,
  background:"rgba(5,12,28,.95)",
  border:`1px solid ${T.border}`,
};
const cdrPgLabelStyle = {
  fontSize:10,
  color:T.muted,
  fontFamily:"'JetBrains Mono',monospace",
};
const cdrPgPageStyle = {
  fontSize:10,
  color:T.cyan,
  fontFamily:"'JetBrains Mono',monospace",
  padding:"0 4px",
};
const cdrRowsSelectStyle = {
  width:58,
  height:22,
  padding:"0 6px",
  borderRadius:6,
  border:`1px solid ${T.border2}`,
  background:T.bg,
  color:T.cyan,
  fontSize:10,
  fontWeight:700,
  fontFamily:"'JetBrains Mono',monospace",
};
const cdrPgActionStyle = (disabled, variant) => ({
  height:22,
  padding:"0 10px",
  borderRadius:6,
  border:`1px solid ${disabled ? T.border : (variant === "next" ? T.cyan : T.border2)}`,
  background:disabled ? T.surf3 : (variant === "next" ? "rgba(44,198,255,.14)" : T.surf),
  color:disabled ? T.muted2 : T.cyan,
  fontSize:10,
  fontWeight:600,
  fontFamily:"'JetBrains Mono',monospace",
  cursor:disabled ? "not-allowed" : "pointer",
  transition:"all .2s",
});

/* ─── TOP CALLERS PAGE ───────────────────────────────── */
const CallersPage = ({cdrData}) => {
  const counts = {};
  cdrData.forEach(r=>{counts[r.caller]=(counts[r.caller]||0)+1});
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const max = sorted[0]?.[1] || 1;

  const hours = Array(24).fill(0);
  cdrData.forEach(r=>{
    const h = parseInt(String(r.datetime || "").split(" ")[1]?.split(":")[0], 10);
    if (!Number.isNaN(h) && h >= 0 && h < 24) hours[h] += 1;
  });
  const peakSlots = [[8,"08:00"],[10,"10:00"],[12,"12:00"],[14,"14:00"],[17,"17:00"],[20,"20:00"],[22,"22:00"]];
  const mxH = Math.max(...peakSlots.map(([h])=>hours[h]));

  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:24,fontWeight:800}}>Top Callers</div>
        <div style={{color:T.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginTop:4}}>// Ranked by total call volume</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
        <Card title="CALL VOLUME RANKING">
          {sorted.map(([num,cnt],i)=>(
            <div key={num} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,marginBottom:2,transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background=T.surf2}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{
                width:22,height:22,borderRadius:6,display:"grid",placeItems:"center",
                fontSize:11,fontWeight:700,flexShrink:0,
                background:i===0?"rgba(251,191,36,.15)":T.surf3,
                color:i===0?T.amber:T.muted,
              }}>{i+1}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,flex:1}}>{num}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.muted,marginRight:10}}>{cnt} calls</div>
              <div style={{width:60,height:4,background:T.surf3,borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.round(cnt/max*100)}%`,background:`linear-gradient(90deg,${T.cyan},${T.violet})`,borderRadius:2}}/>
              </div>
            </div>
          ))}
        </Card>
        <Card title="PEAK HOURS">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {peakSlots.map(([h,label])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:T.muted,width:52,flexShrink:0}}>{label}</div>
                <div style={{flex:1,height:8,background:T.surf3,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.round(hours[h]/mxH*100)}%`,borderRadius:4,background:`linear-gradient(90deg,${T.cyan},${T.violet})`}}/>
                </div>
                <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",width:28,textAlign:"right"}}>{hours[h]}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ─── USERS PAGE ─────────────────────────────────────── */
const UsersPage = ({showToast}) => (
  <div style={{animation:"fadeUp .4s ease both"}}>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
      <div>
        <div style={{fontSize:24,fontWeight:800}}>User Management</div>
        <div style={{color:T.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginTop:4}}>// Role-based access control · JWT auth</div>
      </div>
      <BtnSm onClick={()=>showToast("API: POST /auth/register — Add user flow")}>+ Add User</BtnSm>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
      {USERS.map(u=>(
        <div key={u.email} style={{
          background:T.surf,border:`1px solid ${T.border}`,borderRadius:14,padding:22,
          transition:"all .2s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.border2;e.currentTarget.style.transform="translateY(-2px)"}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)"}}
        >
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:u.grad,display:"grid",placeItems:"center",fontSize:14,fontWeight:800,color:"#05080f",flexShrink:0}}>
              {u.name.split(" ").map(w=>w[0]).join("")}
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:700}}>{u.name}</div>
              <div style={{fontSize:11,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{u.email}</div>
            </div>
          </div>
          <span style={{
            display:"inline-flex",alignItems:"center",gap:5,
            padding:"4px 10px",borderRadius:8,fontSize:10,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",
            background:u.role==="admin"?"rgba(139,92,246,.12)":"rgba(44,198,255,.10)",
            color:u.role==="admin"?T.violet:T.cyan,
          }}>● {u.role}</span>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:14}}>
            {[[u.calls.toLocaleString(),"API Calls"],[u.reports,"Reports"]].map(([v,l])=>(
              <div key={l} style={{background:T.surf2,borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontSize:16,fontWeight:800,marginBottom:2}}>{v}</div>
                <div style={{fontSize:10,color:T.muted,letterSpacing:".05em"}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            {["Edit","Revoke"].map(action=>(
              <button key={action} onClick={()=>showToast(`${action}: ${u.name}`)} style={{
                flex:1,padding:7,borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",
                color:T.muted,fontFamily:"'Space Grotesk',sans-serif",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=action==="Revoke"?T.red:T.cyan;e.currentTarget.style.color=action==="Revoke"?T.red:T.cyan}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.muted}}
              >{action}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── SETTINGS PAGE ─────────────────────────────────── */
const SettingsPage = ({theme,onToggleTheme}) => (
  <div style={{animation:"fadeUp .4s ease both"}}>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
      <div>
        <div style={{fontSize:24,fontWeight:800}}>Settings</div>
        <div style={{color:T.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginTop:4}}>// Application preferences</div>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(2, minmax(280px, 1fr))",gap:16}}>
      <div style={{background:T.surf,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Theme Mode</div>
        <div style={{fontSize:11,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:14}}>
          Current: {theme === "dark" ? "Dark" : "Light"}
        </div>
        <BtnSm onClick={onToggleTheme}>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</BtnSm>
      </div>

      <div style={{background:T.surf,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Dataset Source</div>
        <div style={{fontSize:11,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:14}}>
          Google Sheet with local `mock_cdr.csv` fallback.
        </div>
        <BtnSm onClick={()=>window.open(GOOGLE_SHEET_URL,"_blank","noopener,noreferrer")}>Open Google Sheet</BtnSm>
      </div>
    </div>
  </div>
);

/* ─── API PAGE ───────────────────────────────────────── */
const APIPage = () => {
  const [open,setOpen] = useState(null);
  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
        <div>
          <div style={{fontSize:24,fontWeight:800}}>API Reference</div>
          <div style={{color:T.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginTop:4}}>// REST endpoints · JWT secured · Base: /api/v1</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,background:"rgba(38,214,161,.08)",border:"1px solid rgba(38,214,161,.2)",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.green}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/> All endpoints live
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {ENDPOINTS.map((ep,i)=>(
          <div key={i} style={{background:T.surf,border:`1px solid ${open===i?T.border2:T.border}`,borderRadius:12,overflow:"hidden",transition:"border-color .2s"}}>
            <div onClick={()=>setOpen(open===i?null:i)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",cursor:"pointer"}}>
              <span style={{
                padding:"4px 10px",borderRadius:6,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:500,minWidth:48,textAlign:"center",
                background:ep.method==="GET"?"rgba(38,214,161,.12)":"rgba(251,191,36,.12)",
                color:ep.method==="GET"?T.green:T.amber,
              }}>{ep.method}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,flex:1}}>/api/v1{ep.path}</span>
              <span style={{fontSize:12,color:T.muted}}>{ep.desc}</span>
              <span style={{
                fontSize:10,fontFamily:"'JetBrains Mono',monospace",padding:"2px 8px",borderRadius:5,
                background:ep.auth?"rgba(139,92,246,.1)":"rgba(38,214,161,.08)",
                color:ep.auth?T.violet:T.green,marginLeft:8,
              }}>{ep.auth?"🔒 JWT":"Public"}</span>
              <span style={{color:T.muted,marginLeft:8,transition:"transform .2s",transform:open===i?"rotate(180deg)":"rotate(0)"}}>▾</span>
            </div>
            {open===i&&(
              <div style={{borderTop:`1px solid ${T.border}`,padding:"16px 18px",background:T.surf2}}>
                <pre style={{
                  background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:14,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.cyan,lineHeight:1.7,
                  overflow:"auto",whiteSpace:"pre",
                }}>{ep.body}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── ROOT APP ───────────────────────────────────────── */
export default function App() {
  const [authed,setAuthed] = useState(false);
  const [role,setRole] = useState("admin");
  const [page,setPage] = useState("dashboard");
  const [toast,setToast] = useState({msg:"",visible:false});
  const [cdrData,setCdrData] = useState([]);
  const [theme,setTheme] = useState(() => localStorage.getItem("tip-theme") || "dark");

  // Inject global styles
  useEffect(()=>{
    const el=document.createElement("style");
    el.textContent=GLOBAL_CSS;
    document.head.appendChild(el);
    return()=>el.remove();
  },[]);

  useEffect(() => {
    let dead = false;
    const load = async () => {
      const rows = await loadSheetCdrData();
      if (dead) return;
      if (rows.length > 0) {
        setCdrData(rows);
        return;
      }

      const fallbackRows = await loadFallbackCdrData();
      if (dead) return;
      setCdrData(fallbackRows);
    };
    load();
    return () => { dead = true; };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const vars = THEME_VARS[theme] || THEME_VARS.dark;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.colorScheme = theme;
    localStorage.setItem("tip-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!["dashboard","users","settings","api"].includes(page)) {
      setPage("dashboard");
    }
  }, [page]);

  const showToast = msg => {
    setToast({msg,visible:true});
    setTimeout(()=>setToast(t=>({...t,visible:false})),3000);
  };

  const handleLogin = r => {
    setRole(r);
    setPage("dashboard");
    setAuthed(true);
    showToast(`Authenticated via JWT · Welcome, ${r==="admin"?"Admin":"Analyst"}!`);
  };
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  if(!authed) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <LoginPage onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme}/>
      <Toast {...toast}/>
    </>
  );

  const pages = {
    dashboard:<Dashboard setPage={setPage} showToast={showToast} cdrData={cdrData}/>,
    users:<UsersPage showToast={showToast}/>,
    settings:<SettingsPage theme={theme} onToggleTheme={toggleTheme}/>,
    api:<APIPage/>,
  };

  return (
    <>
      {/* bg grid */}
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(rgba(44,198,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(44,198,255,.022) 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",width:700,height:700,borderRadius:"50%",filter:"blur(140px)",background:"rgba(44,198,255,.04)",top:-200,left:-200,animation:"blobdrift 14s ease-in-out infinite alternate",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",width:600,height:600,borderRadius:"50%",filter:"blur(140px)",background:"rgba(139,92,246,.05)",bottom:-150,right:-150,animation:"blobdrift 18s ease-in-out infinite alternate-reverse",pointerEvents:"none",zIndex:0}}/>

      <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative",zIndex:1}}>
        <Topbar role={role} theme={theme} onToggleTheme={toggleTheme}/>
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",flex:1,minHeight:"calc(100vh - 56px)"}}>
          <Sidebar page={page} setPage={setPage} role={role} onLogout={()=>{setAuthed(false);setPage("dashboard")}}/>
          <main style={{padding:28,overflowY:"auto",background:"transparent"}}>
            {pages[page]}
          </main>
        </div>
      </div>

      <Toast {...toast}/>
    </>
  );
}
