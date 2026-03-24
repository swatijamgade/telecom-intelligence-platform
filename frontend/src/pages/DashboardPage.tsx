import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

// Real PineVox logo (base64 embedded, no external request needed)
const LOGO = "data:image/png;base64,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";

// Design tokens
const C = {
  bg: "#07090f",
  bg2: "#0b0f1a",
  bg3: "#0f1420",
  card: "#111827",
  border: "#1a2540",
  border2: "#243060",
  t1: "#e8eeff",
  t2: "#7a93cc",
  t3: "#3d5280",
  acc: "#2563eb",
  acc2: "#3b82f6",
  accGlow: "rgba(37,99,235,0.13)",
  green: "#22c55e",
  greenBg: "rgba(34,197,94,0.1)",
  greenB: "rgba(34,197,94,0.22)",
  amber: "#fbbf24",
  amberBg: "rgba(251,191,36,0.1)",
  amberB: "rgba(251,191,36,0.22)",
  red: "#f87171",
  redBg: "rgba(248,113,113,0.1)",
  redB: "rgba(248,113,113,0.22)",
  teal: "#2dd4bf",
  tealBg: "rgba(45,212,191,0.1)",
  tealB: "rgba(45,212,191,0.22)",
} as const;

type CdrStatus = "active" | "suspended" | "ended";
type CdrType = "Inbound" | "Outbound";

interface CdrRow {
  id: string;
  caller: string;
  receiver: string;
  city: string;
  location: string;
  type: CdrType;
  duration: string;
  date: string;
  status: CdrStatus;
  cost: string;
}

interface WeekRow {
  in: number;
  out: number;
}

interface Filters {
  search: string;
  city: string;
  type: "" | CdrType;
  status: "" | CdrStatus;
  from: string;
  to: string;
  location: string;
}

interface TagItem {
  k: keyof Filters;
  label: string;
}

interface StatItem {
  color: string;
  bg: string;
  b: string;
  Icon: () => ReactNode;
  val: number | null;
  label: string;
  sub: string;
  spark: number[];
}

const CDR_DATA: CdrRow[] = [
  {
    id: "CDR-0001",
    caller: "+92-300-1234567",
    receiver: "+92-321-9876543",
    city: "Karachi",
    location: "Gulshan",
    type: "Inbound",
    duration: "4m 21s",
    date: "2024-07-15 09:12",
    status: "active",
    cost: "£0.04",
  },
  {
    id: "CDR-0002",
    caller: "+44-7800-987654",
    receiver: "+44-7911-112233",
    city: "London",
    location: "Harrow",
    type: "Outbound",
    duration: "1m 08s",
    date: "2024-07-15 09:45",
    status: "ended",
    cost: "£0.02",
  },
  {
    id: "CDR-0003",
    caller: "+92-333-5551234",
    receiver: "+92-311-4449876",
    city: "Lahore",
    location: "DHA",
    type: "Inbound",
    duration: "12m 44s",
    date: "2024-07-15 10:02",
    status: "active",
    cost: "£0.13",
  },
  {
    id: "CDR-0004",
    caller: "+44-7922-445566",
    receiver: "+44-7855-778899",
    city: "Manchester",
    location: "City Centre",
    type: "Outbound",
    duration: "0m 53s",
    date: "2024-07-15 10:18",
    status: "suspended",
    cost: "£0.01",
  },
  {
    id: "CDR-0005",
    caller: "+92-345-7778888",
    receiver: "+92-300-6665544",
    city: "Islamabad",
    location: "F-7",
    type: "Inbound",
    duration: "7m 16s",
    date: "2024-07-15 10:35",
    status: "ended",
    cost: "£0.07",
  },
  {
    id: "CDR-0006",
    caller: "+44-7733-223344",
    receiver: "+44-7900-556677",
    city: "Birmingham",
    location: "Jewellery Q",
    type: "Outbound",
    duration: "3m 42s",
    date: "2024-07-15 11:00",
    status: "active",
    cost: "£0.04",
  },
  {
    id: "CDR-0007",
    caller: "+92-321-8887766",
    receiver: "+92-333-1112233",
    city: "Faisalabad",
    location: "D Ground",
    type: "Inbound",
    duration: "9m 05s",
    date: "2024-07-15 11:22",
    status: "ended",
    cost: "£0.09",
  },
];

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WDATA: WeekRow[] = [
  { in: 310, out: 212 },
  { in: 420, out: 294 },
  { in: 265, out: 181 },
  { in: 510, out: 361 },
  { in: 384, out: 272 },
  { in: 160, out: 112 },
  { in: 231, out: 148 },
];

// Icons
const DashIco = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" opacity=".5" />
    <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" opacity=".5" />
    <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" />
  </svg>
);

const CdrIco = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2" width="12" height="1.4" rx=".7" fill="currentColor" />
    <rect x="1" y="6" width="8" height="1.4" rx=".7" fill="currentColor" opacity=".65" />
    <rect x="1" y="10" width="10" height="1.4" rx=".7" fill="currentColor" opacity=".65" />
  </svg>
);

const TopIco = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="5" cy="4.5" r="2.5" fill="currentColor" opacity=".85" />
    <path d="M.5 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <path d="M10 5.5c1 .5 1.5 1.4 1.5 2.5" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity=".55" />
  </svg>
);

const UsrIco = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="4.5" r="2.8" fill="currentColor" opacity=".85" />
    <path d="M1 13c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

const ApiIco = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M4 2.5L1.5 7 4 11.5M10 2.5l2.5 4.5L10 11.5M8 2l-2 10" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIco = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M1.5 3a1 1 0 011-1h2a1 1 0 01.95.68l.8 2.4a1 1 0 01-.23 1.02L4.8 7.3a8.5 8.5 0 004.2 4.2l1.2-1.22a1 1 0 011.03-.24l2.4.8a1 1 0 01.69.95V14a1 1 0 01-1 1C6 15 0 9 0 2a1 1 0 011-1h.5z" fill="currentColor" opacity=".9" />
  </svg>
);

const CheckIco = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6.5" fill="currentColor" opacity=".15" />
    <path d="M4.5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarnIco = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5l6.5 12h-13z" fill="currentColor" opacity=".15" />
    <path d="M7.5 5.5v3.5M7.5 10.5h.01" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

const ClockIco = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7.5 4.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const SearchIco = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <circle cx="5" cy="5" r="3.8" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8.2 8.2L10.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const XIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M1.5 1.5l6 6M7.5 1.5l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ChevIco = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 3.5l3 3.5 3-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

function Counter({ target }: { target: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const s = performance.now();
    const d = 800;

    const tick = (n: number) => {
      const p = Math.min((n - s) / d, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(e * target));
      if (p < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    };

    ref.current = requestAnimationFrame(tick);

    return () => {
      if (ref.current !== null) {
        cancelAnimationFrame(ref.current);
      }
    };
  }, [target]);

  return <>{v.toLocaleString()}</>;
}

function Spark({ data, color }: { data: number[]; color: string }) {
  const w = 70;
  const h = 22;
  const mx = Math.max(...data);
  const mn = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / (mx - mn || 1)) * h}`).join(" ");
  const lastPair = pts.split(" ").pop()?.split(",") ?? ["0", "0"];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
      <circle cx={lastPair[0]} cy={lastPair[1]} r="2.5" fill={color} />
    </svg>
  );
}

function BarChart({ hov, setHov }: { hov: number | null; setHov: (value: number | null) => void }) {
  const max = Math.max(...WDATA.map((d) => d.in + d.out));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 96, paddingTop: 8, position: "relative" }}>
      {WDATA.map((d, i) => {
        const h = ((d.in + d.out) / max) * 100;
        const act = hov === i;

        return (
          <div
            key={WEEK[i]}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer" }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            {act && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: `calc(${i * 14.28}% + 1px)`,
                  background: C.card,
                  border: `1px solid ${C.border2}`,
                  borderRadius: 5,
                  padding: "3px 7px",
                  fontSize: 9,
                  color: C.t1,
                  whiteSpace: "nowrap",
                  zIndex: 9,
                }}
              >
                ↑{d.in} ↓{d.out}
              </div>
            )}
            <div
              style={{
                width: "100%",
                height: `${h}%`,
                borderRadius: "3px 3px 0 0",
                transition: "all .2s",
                background: act
                  ? `linear-gradient(180deg,${C.acc2},${C.acc})`
                  : "linear-gradient(180deg,rgba(96,165,250,.45),rgba(37,99,235,.18))",
                border: `1px solid rgba(37,99,235,${act ? 0.6 : 0.22})`,
              }}
            />
            <span style={{ fontSize: 9, color: C.t3, fontFamily: "monospace" }}>{WEEK[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

function Donut() {
  const [hov, setHov] = useState<number | null>(null);
  const r = 40;
  const cx = 52;
  const cy = 52;
  const circ = 2 * Math.PI * r;

  const segs = [
    { label: "Inbound", val: 566, pct: 47.2, color: C.acc2 },
    { label: "Outbound", val: 634, pct: 52.8, color: C.green },
  ];

  let off = 0;
  const slices = segs.map((s) => {
    const l = (s.pct / 100) * circ;
    const entry = { ...s, off, l };
    off += l;
    return entry;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <svg width="104" height="104" viewBox="0 0 104 104" style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="12" />
        {slices.map((s, i) => (
          <circle
            key={s.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={hov === i ? 15 : 11}
            strokeDasharray={`${s.l} ${circ - s.l}`}
            strokeDashoffset={-s.off}
            style={{ transform: "rotate(-90deg)", transformOrigin: "52px 52px", transition: "stroke-width .18s", cursor: "pointer" }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          />
        ))}
        <text x={cx} y={cx - 4} textAnchor="middle" fill={C.t1} fontSize="13" fontWeight="700" fontFamily="monospace">
          1.2K
        </text>
        <text x={cx} y={cx + 10} textAnchor="middle" fill={C.t3} fontSize="7.5">
          TOTAL
        </text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {segs.map((s, i) => (
          <div key={s.label} style={{ cursor: "pointer" }} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
              <span style={{ fontSize: 11.5, color: hov === i ? C.t1 : C.t2, transition: "color .15s" }}>{s.label}</span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 11,
                  fontWeight: 700,
                  color: s.color,
                  fontFamily: "monospace",
                  paddingLeft: 8,
                }}
              >
                {s.val}
              </span>
            </div>
            <div style={{ fontSize: 10, color: C.t3, paddingLeft: 14 }}>{s.pct}%</div>
          </div>
        ))}
        <div style={{ fontSize: 10, color: C.t3, paddingTop: 2 }}>Avg: 0h 29m 33s</div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: CdrStatus }) {
  const M = {
    active: { c: C.green, bg: C.greenBg, b: C.greenB, label: "Active" },
    suspended: { c: C.amber, bg: C.amberBg, b: C.amberB, label: "Suspended" },
    ended: { c: C.t3, bg: C.bg3, b: C.border, label: "Ended" },
  }[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 600,
        color: M.c,
        background: M.bg,
        border: `1px solid ${M.b}`,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
      {M.label}
    </span>
  );
}

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 8px 4px 10px",
        background: C.accGlow,
        border: "1px solid rgba(37,99,235,0.25)",
        borderRadius: 999,
        fontSize: 11,
        color: C.acc2,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{ background: "none", border: "none", cursor: "pointer", color: C.t3, padding: 0, display: "flex", alignItems: "center", lineHeight: 1 }}
      >
        <XIcon />
      </button>
    </div>
  );
}

function Sel({
  value,
  onChange,
  options,
  placeholder,
  full,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div style={{ position: "relative", width: full ? "100%" : "auto" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: C.bg3,
          border: `1px solid ${C.border2}`,
          color: value ? C.t1 : C.t3,
          borderRadius: 7,
          padding: "8px 28px 8px 11px",
          fontSize: 12.5,
          fontFamily: "inherit",
          outline: "none",
          appearance: "none",
          cursor: "pointer",
          colorScheme: "dark",
        }}
      >
        <option value="">{placeholder || "All"}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: C.t3, pointerEvents: "none" }}>
        <ChevIco />
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [nav, setNav] = useState(0);
  const [hovBar, setHovBar] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  const [f, setF] = useState<Filters>({
    search: "",
    city: "",
    type: "",
    status: "",
    from: "",
    to: "",
    location: "",
  });

  const setFilter = <K extends keyof Filters>(k: K, v: Filters[K]) => {
    setF((p) => ({ ...p, [k]: v }));
  };

  const tags = [
    f.city && { k: "city", label: `City: ${f.city}` },
    f.type && { k: "type", label: `Type: ${f.type}` },
    f.status && { k: "status", label: `Status: ${f.status}` },
    f.location && { k: "location", label: `Location: ${f.location}` },
    f.from && { k: "from", label: `From: ${f.from}` },
    f.to && { k: "to", label: `To: ${f.to}` },
  ].filter((x): x is TagItem => Boolean(x));

  const filtered = CDR_DATA.filter((r) => {
    if (f.search && !r.caller.includes(f.search) && !r.receiver.includes(f.search) && !r.id.includes(f.search)) return false;
    if (f.city && r.city !== f.city) return false;
    if (f.type && r.type !== f.type) return false;
    if (f.status && r.status !== f.status) return false;
    if (f.location && r.location !== f.location) return false;
    return true;
  });

  const reset = () =>
    setF({
      search: "",
      city: "",
      type: "",
      status: "",
      from: "",
      to: "",
      location: "",
    });

  const CITIES = [...new Set(CDR_DATA.map((r) => r.city))];
  const LOCS = [...new Set(CDR_DATA.map((r) => r.location))];

  const STATS: StatItem[] = [
    {
      color: C.acc2,
      bg: C.accGlow,
      b: "rgba(96,165,250,0.2)",
      Icon: PhoneIco,
      val: 1200,
      label: "Total Calls",
      sub: "1,200 records in range",
      spark: [900, 1000, 870, 1100, 1200, 980, 1200],
    },
    {
      color: C.green,
      bg: C.greenBg,
      b: C.greenB,
      Icon: CheckIco,
      val: 1200,
      label: "Active Calls",
      sub: "566 in / 634 out",
      spark: [400, 520, 480, 600, 566, 490, 566],
    },
    {
      color: C.amber,
      bg: C.amberBg,
      b: C.amberB,
      Icon: WarnIco,
      val: 0,
      label: "Suspended",
      sub: "Derived from totals",
      spark: [2, 1, 0, 1, 0, 0, 0],
    },
    {
      color: C.teal,
      bg: C.tealBg,
      b: C.tealB,
      Icon: ClockIco,
      val: null,
      label: "Avg Duration",
      sub: "591h 0m 43s total",
      spark: [25, 30, 22, 35, 29, 28, 29],
    },
  ];

  const inp = {
    width: "100%",
    background: C.bg3,
    border: `1px solid ${C.border2}`,
    color: C.t1,
    borderRadius: 7,
    padding: "8px 11px",
    fontSize: 12.5,
    fontFamily: "inherit",
    outline: "none",
  } as const;

  const lbl = {
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: C.t3,
    marginBottom: 5,
    display: "block",
  } as const;

  const ff = { fontFamily: "'Sora','Segoe UI',sans-serif" } as const;

  return (
    <div style={{ ...ff, display: "flex", height: "100vh", background: C.bg, color: C.t1, overflow: "hidden" }}>
      <aside
        style={{
          width: 212,
          minWidth: 212,
          background: C.bg2,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 220,
            height: 220,
            background: "radial-gradient(circle,rgba(37,99,235,0.06) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ padding: "16px 18px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center" }}>
          <img src={LOGO} alt="PineVox" style={{ height: 30, maxWidth: 150, objectFit: "contain", objectPosition: "left center" }} />
        </div>

        <nav style={{ padding: "14px 10px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.3px", textTransform: "uppercase", color: C.t3, padding: "0 8px 8px" }}>
            Navigation
          </div>
          {[
            { icon: <DashIco />, label: "Dashboard", badge: "Live" },
            { icon: <CdrIco />, label: "CDRs" },
            { icon: <TopIco />, label: "Top Callers" },
            { icon: <UsrIco />, label: "Users" },
            { icon: <ApiIco />, label: "API Reference" },
          ].map((n, i) => (
            <div
              key={n.label}
              onClick={() => setNav(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 10px",
                borderRadius: 8,
                cursor: "pointer",
                marginBottom: 2,
                fontSize: 12.5,
                fontWeight: 500,
                transition: "all .14s",
                color: nav === i ? C.acc2 : C.t2,
                background: nav === i ? C.accGlow : "transparent",
                border: `1px solid ${nav === i ? "rgba(37,99,235,0.2)" : "transparent"}`,
              }}
            >
              <span style={{ flexShrink: 0 }}>{n.icon}</span>
              {n.label}
              {n.badge && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 8.5,
                    background: C.green,
                    color: "#000",
                    borderRadius: 999,
                    padding: "1px 6px",
                    fontWeight: 700,
                  }}
                >
                  {n.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8, fontSize: 12, color: C.t2, cursor: "pointer" }}>
            <span>🌙</span>
            <span>Dark mode</span>
            <div style={{ marginLeft: "auto", width: 28, height: 15, borderRadius: 999, background: C.acc, position: "relative" }}>
              <div style={{ position: "absolute", right: 3, top: 2.5, width: 10, height: 10, background: "#fff", borderRadius: "50%" }} />
            </div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 26px",
            background: C.bg2,
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, margin: 0 }}>Welcome, Super Admin! 👋</h1>
            <p style={{ fontSize: 11, color: C.t3, margin: "2px 0 0" }}>Telecom Intelligence Platform Dashboard</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 5,
                background: C.greenBg,
                color: C.green,
                border: `1px solid ${C.greenB}`,
              }}
            >
              ● API LIVE
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 5, color: C.t2, border: `1px solid ${C.border2}` }}>Mock CSV</span>
            <div style={{ textAlign: "right", fontSize: 11 }}>
              <div style={{ color: C.t1, fontWeight: 600 }}>admin@example.com</div>
              <div style={{ fontSize: 10, color: C.t3 }}>Super Admin</div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              SA
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "18px 26px", display: "flex", flexDirection: "column", gap: 15 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div
              onClick={() => setPanelOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                cursor: "pointer",
                borderBottom: `1px solid ${panelOpen ? C.border : "transparent"}`,
                transition: "border-color .2s",
                userSelect: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 2.5h12M3.5 7h7M6 11.5h2" stroke={C.acc2} strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Filters</span>
                <span style={{ fontSize: 10.5, color: C.t3 }}>— refine by number, city, type, date</span>
                {tags.length > 0 && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: C.accGlow,
                      color: C.acc2,
                      border: "1px solid rgba(37,99,235,0.22)",
                    }}
                  >
                    {tags.length} active
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {tags.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      reset();
                    }}
                    style={{
                      background: "none",
                      border: `1px solid ${C.border2}`,
                      color: C.t3,
                      borderRadius: 5,
                      padding: "3px 10px",
                      fontSize: 11,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Clear all
                  </button>
                )}
                <span style={{ color: C.t3, transform: panelOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s", display: "inline-block", lineHeight: 1 }}>▾</span>
              </div>
            </div>

            {panelOpen && tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 18px", borderBottom: `1px solid ${C.border}` }}>
                {tags.map((t) => (
                  <Tag key={t.k} label={t.label} onRemove={() => setFilter(t.k, "")} />
                ))}
              </div>
            )}

            {panelOpen && (
              <div style={{ padding: "14px 18px 16px" }}>
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.t3, pointerEvents: "none" }}>
                    <SearchIco />
                  </span>
                  <input
                    value={f.search}
                    onChange={(e) => setFilter("search", e.target.value)}
                    placeholder="Search by CDR ID, caller number, or receiver…"
                    style={{ ...inp, paddingLeft: 30 }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={lbl}>City</label>
                    <Sel value={f.city} onChange={(v) => setFilter("city", v)} options={CITIES} placeholder="All cities" full />
                  </div>
                  <div>
                    <label style={lbl}>Location / Area</label>
                    <Sel value={f.location} onChange={(v) => setFilter("location", v)} options={LOCS} placeholder="All areas" full />
                  </div>
                  <div>
                    <label style={lbl}>Call Type</label>
                    <Sel value={f.type} onChange={(v) => setFilter("type", v as Filters["type"])} options={["Inbound", "Outbound"]} placeholder="All types" full />
                  </div>
                  <div>
                    <label style={lbl}>Status</label>
                    <Sel
                      value={f.status}
                      onChange={(v) => setFilter("status", v as Filters["status"])}
                      options={["active", "ended", "suspended"]}
                      placeholder="All statuses"
                      full
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "flex-end" }}>
                  <div>
                    <label style={lbl}>Date From</label>
                    <input type="date" value={f.from} onChange={(e) => setFilter("from", e.target.value)} style={{ ...inp, colorScheme: "dark" }} />
                  </div>
                  <div>
                    <label style={lbl}>Date To</label>
                    <input type="date" value={f.to} onChange={(e) => setFilter("to", e.target.value)} style={{ ...inp, colorScheme: "dark" }} />
                  </div>
                  <div />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={reset}
                      style={{
                        background: "transparent",
                        color: C.t2,
                        border: `1px solid ${C.border2}`,
                        padding: "8px 16px",
                        borderRadius: 7,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Reset
                    </button>
                    <button
                      style={{
                        background: `linear-gradient(135deg,${C.acc},${C.acc2})`,
                        color: "#fff",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: 7,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <SearchIco /> Run Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "15px 17px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all .18s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.border2;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color},${s.color}88)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 9 }}>
                  <div style={{ width: 33, height: 33, borderRadius: 8, background: s.bg, border: `1px solid ${s.b}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                    <s.Icon />
                  </div>
                  <Spark data={s.spark} color={s.color} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.7, lineHeight: 1, marginBottom: 3, color: s.color, fontFamily: "monospace" }}>
                  {s.val !== null ? <Counter target={s.val} /> : "0h 29m 33s"}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: C.t2, marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: C.t3 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Call Volume — This Week</div>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Daily inbound + outbound breakdown</div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 10.5 }}>
                  {[
                    { c: C.acc2, l: "Inbound" },
                    { c: C.green, l: "Outbound" },
                  ].map((x) => (
                    <span key={x.l} style={{ display: "flex", alignItems: "center", gap: 4, color: C.t3 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 2, background: x.c, display: "inline-block" }} />
                      {x.l}
                    </span>
                  ))}
                </div>
              </div>
              <BarChart hov={hovBar} setHov={setHovBar} />
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>Call Distribution</div>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 14 }}>Inbound vs Outbound</div>
              <Donut />
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Call Detail Records (CDRs)</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
                  Showing {filtered.length} of {CDR_DATA.length} records
                </div>
              </div>
              <button
                style={{
                  background: "transparent",
                  color: C.acc2,
                  border: "1px solid rgba(37,99,235,.3)",
                  padding: "6px 13px",
                  borderRadius: 7,
                  fontSize: 11.5,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Export CSV ↓
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ background: C.bg3 }}>
                    {["CDR ID", "Caller", "Receiver", "City", "Location", "Type", "Duration", "Date", "Cost", "Status"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "9px 12px",
                          textAlign: "left",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.8px",
                          textTransform: "uppercase",
                          color: C.t3,
                          borderBottom: `1px solid ${C.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", transition: "background .13s", cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = C.bg3;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td style={{ padding: "10px 12px", fontSize: 10.5, color: C.acc2, fontFamily: "monospace", fontWeight: 600 }}>{r.id}</td>
                      <td style={{ padding: "10px 12px", fontSize: 10.5, color: C.t1, fontFamily: "monospace" }}>{r.caller}</td>
                      <td style={{ padding: "10px 12px", fontSize: 10.5, color: C.t2, fontFamily: "monospace" }}>{r.receiver}</td>
                      <td style={{ padding: "10px 12px", fontSize: 11.5, color: C.t2 }}>{r.city}</td>
                      <td style={{ padding: "10px 12px", fontSize: 11, color: C.t3 }}>{r.location}</td>
                      <td style={{ padding: "10px 12px", fontSize: 11.5, color: r.type === "Inbound" ? C.acc2 : C.green, fontWeight: 600 }}>{r.type}</td>
                      <td style={{ padding: "10px 12px", fontSize: 10.5, color: C.t2, fontFamily: "monospace" }}>{r.duration}</td>
                      <td style={{ padding: "10px 12px", fontSize: 10, color: C.t3, whiteSpace: "nowrap" }}>{r.date}</td>
                      <td style={{ padding: "10px 12px", fontSize: 11, color: C.green, fontWeight: 600, fontFamily: "monospace" }}>{r.cost}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <StatusPill status={r.status} />
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{ padding: 32, textAlign: "center", color: C.t3, fontSize: 13 }}>
                        No records match the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </main>
    </div>
  );
}
