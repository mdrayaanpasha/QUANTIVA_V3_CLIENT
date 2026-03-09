import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from "recharts";

const TICKERS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "META", name: "Meta Platforms" },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices" },
  { symbol: "INTC", name: "Intel Corp." },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "ORCL", name: "Oracle Corp." },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "PYPL", name: "PayPal Holdings" },
  { symbol: "UBER", name: "Uber Technologies" },
  { symbol: "SPOT", name: "Spotify Technology" },
  { symbol: "SHOP", name: "Shopify Inc." },
  { symbol: "SQ", name: "Block Inc." },
  { symbol: "COIN", name: "Coinbase Global" },
  { symbol: "PLTR", name: "Palantir Technologies" },
  { symbol: "SNOW", name: "Snowflake Inc." },
  { symbol: "DDOG", name: "Datadog Inc." },
  { symbol: "NET", name: "Cloudflare Inc." },
  { symbol: "CRWD", name: "CrowdStrike Holdings" },
  { symbol: "ZM", name: "Zoom Video Comm." },
  { symbol: "TEAM", name: "Atlassian Corp." },
  { symbol: "MDB", name: "MongoDB Inc." },
  { symbol: "GTLB", name: "GitLab Inc." },
  { symbol: "NOW", name: "ServiceNow Inc." },
  { symbol: "WDAY", name: "Workday Inc." },
  { symbol: "PANW", name: "Palo Alto Networks" },
  { symbol: "IBM", name: "IBM Corp." },
  { symbol: "DELL", name: "Dell Technologies" },
  { symbol: "QCOM", name: "Qualcomm Inc." },
  { symbol: "AVGO", name: "Broadcom Inc." },
  { symbol: "TXN", name: "Texas Instruments" },
  { symbol: "JPM", name: "JPMorgan Chase" },
  { symbol: "BAC", name: "Bank of America" },
  { symbol: "GS", name: "Goldman Sachs" },
  { symbol: "MS", name: "Morgan Stanley" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "MA", name: "Mastercard Inc." },
  { symbol: "PFE", name: "Pfizer Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "UNH", name: "UnitedHealth Group" },
  { symbol: "DIS", name: "Walt Disney Co." },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "COST", name: "Costco Wholesale" },
  { symbol: "HD", name: "Home Depot Inc." },
  { symbol: "NKE", name: "Nike Inc." },
  { symbol: "SBUX", name: "Starbucks Corp." },
  { symbol: "MCD", name: "McDonald's Corp." },
  { symbol: "AMGN", name: "Amgen Inc." },
];

const API_BASE = "https://quantiva-3-0-service-1.onrender.com";

const WAKE_STEPS = [
  {
    id: "ping",
    label: "Waking up the backend servers",
    eta: "~30–60 sec",
    detail: "Quantiva runs on Render's free hosting tier, which automatically shuts down idle servers after 15 minutes to conserve resources. Your request just triggered a \"cold start\" — all 4 microservices are booting up now. This is completely normal and only happens on the first request per session.",
  },
  {
    id: "queue",
    label: "Servers online — connecting job queue",
    eta: "~3 sec",
    detail: "All 4 services are responding. The system is now initialising RabbitMQ, the internal message broker that routes analysis jobs to the right workers. Think of it as the dispatcher for the system.",
  },
  {
    id: "workers",
    label: "Running analysis workers in parallel",
    eta: "~5 sec",
    detail: "Three independent workers are now running simultaneously — one each for EMA, SMA, and RSI. Results are combined and returned once all three complete.",
  },
];

const themes = {
  light: {
    bg: "#f8f8f6",
    surface: "#ffffff",
    surfaceAlt: "#f3f3f0",
    border: "#e6e6e0",
    borderStrong: "#c8c8c0",
    text: "#111110",
    textSub: "#65655e",
    textMuted: "#9f9f97",
    accent: "#059669",
    accentText: "#065f46",
    accentBg: "#f0fdf8",
    accentBorder: "#6ee7b7",
    red: "#dc2626",
    redBg: "#fef2f2",
    redBorder: "#fecaca",
    blue: "#2563eb",
    blueBg: "#eff6ff",
    blueBorder: "#bfdbfe",
    amber: "#b45309",
    amberBg: "#fffbeb",
    amberBorder: "#fde68a",
    chartStroke: "#059669",
    shadow: "0 1px 2px rgba(0,0,0,0.05)",
    shadowMd: "0 4px 14px rgba(0,0,0,0.07)",
  },
  dark: {
    bg: "#111110",
    surface: "#1c1c1a",
    surfaceAlt: "#242422",
    border: "#2e2e2a",
    borderStrong: "#3e3e3a",
    text: "#eeeeea",
    textSub: "#8a8a82",
    textMuted: "#55554e",
    accent: "#10b981",
    accentText: "#34d399",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.22)",
    red: "#f87171",
    redBg: "rgba(248,113,113,0.07)",
    redBorder: "rgba(248,113,113,0.2)",
    blue: "#60a5fa",
    blueBg: "rgba(96,165,250,0.07)",
    blueBorder: "rgba(96,165,250,0.2)",
    amber: "#fbbf24",
    amberBg: "rgba(251,191,36,0.07)",
    amberBorder: "rgba(251,191,36,0.2)",
    chartStroke: "#10b981",
    shadow: "0 1px 3px rgba(0,0,0,0.25)",
    shadowMd: "0 4px 16px rgba(0,0,0,0.4)",
  },
};

const CustomTooltip = ({ active, payload, label, t }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.borderStrong}`,
      borderRadius: 8, padding: "12px 16px",
      fontFamily: "'DM Mono', monospace",
      boxShadow: t.shadowMd, minWidth: 150,
    }}>
      <p style={{ color: t.textMuted, fontSize: 10, marginBottom: 6 }}>{label}</p>
      <p style={{ color: t.text, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
        ${Number(payload[0].value).toFixed(2)}
      </p>
      {d && (
        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 14px" }}>
          {[["O", d.open], ["H", d.high], ["L", d.low], ["Vol", d.volume]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: t.textSub }}>
              <span>{k}</span>
              <span>{k === "Vol" ? `${(v / 1e6).toFixed(0)}M` : `$${Number(v).toFixed(2)}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Analysis() {
  const [isDark, setIsDark] = useState(false);
  const t = themes[isDark ? "dark" : "light"];

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-02-01");
  const [loading, setLoading] = useState(false);
  const [wakeStep, setWakeStep] = useState(-1);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const dropRef = useRef(null);

  const filtered = TICKERS.filter(tk =>
    tk.symbol.toLowerCase().includes(query.toLowerCase()) ||
    tk.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const analyze = async () => {
    if (!selected) return;
    setLoading(true); setError(null); setData(null); setWakeStep(0);
    await Promise.allSettled([
      fetch("https://quantiva-3-0-service-1.onrender.com/health"),
      fetch("https://quantiva-3-0-service-2.onrender.com/health"),
      fetch("https://quantiva-3-0-service-3.onrender.com/health"),
      fetch("https://quantiva-3-0-service-4.onrender.com/health"),
    ]);
    setWakeStep(1);
    await new Promise(r => setTimeout(r, 2000));
    setWakeStep(2);
    try {
      const res = await fetch(`${API_BASE}/initiate-company-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: selected.symbol, startDate, endDate }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false); setWakeStep(-1);
    }
  };

  const candles = data?.data || data?.candles || [];
  const chartData = candles.map(c => ({
    date: new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    close: parseFloat(c.close?.toFixed(2)),
    open: c.open, high: c.high, low: c.low, volume: c.volume,
  }));

  const getInd = type => (data?.results || []).find(i => i.type === type);
  const ema = getInd("ema");
  const sma = getInd("sma");
  const rsi = getInd("rsi");
  const rsiState = !rsi?.result ? null : rsi.result >= 70 ? "overbought" : rsi.result <= 30 ? "oversold" : "neutral";
  const rsiColor = rsiState === "overbought" ? t.red : rsiState === "oversold" ? t.accent : t.amber;

  const latestClose = candles.at(-1)?.close;
  const firstClose = candles[0]?.close;
  const priceChange = latestClose && firstClose
    ? ((latestClose - firstClose) / firstClose * 100).toFixed(2) : null;
  const isUp = Number(priceChange) >= 0;

  const chartMin = chartData.length ? Math.min(...chartData.map(d => d.close)) * 0.993 : "auto";
  const chartMax = chartData.length ? Math.max(...chartData.map(d => d.close)) * 1.007 : "auto";

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s, color 0.2s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.35; cursor: pointer; filter: ${isDark ? "invert(1)" : "none"}; }
        .ticker-row:hover { background: ${t.surfaceAlt} !important; }
        .card-hover { transition: box-shadow 0.18s, border-color 0.18s; }
        .card-hover:hover { border-color: ${t.borderStrong} !important; box-shadow: ${t.shadowMd} !important; }
        .tr-hover:hover td { background: ${t.surfaceAlt}; }
        .btn-run {
          background: ${t.accent}; color: #fff; border: none; border-radius: 8px;
          padding: 11px 28px; font-family: 'DM Mono', monospace; font-size: 12px;
          font-weight: 500; letter-spacing: 0.5px; cursor: pointer;
          transition: filter 0.15s, transform 0.1s, box-shadow 0.15s; white-space: nowrap;
        }
        .btn-run:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(5,150,105,0.2); }
        .btn-run:active:not(:disabled) { transform: translateY(0); }
        .btn-run:disabled { opacity: 0.45; cursor: not-allowed; }
        .theme-btn {
          background: ${t.surfaceAlt}; border: 1px solid ${t.border}; border-radius: 20px;
          padding: 5px 14px; cursor: pointer; font-family: 'DM Mono', monospace;
          font-size: 11px; color: ${t.textSub}; display: flex; align-items: center; gap: 6px;
          transition: background 0.15s;
        }
        .theme-btn:hover { background: ${t.border}; }
        input:focus, select:focus { outline: 2px solid ${t.accentBorder}; outline-offset: -1px; border-radius: 8px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .spinner { display:inline-block; width:13px; height:13px; border:2px solid rgba(255,255,255,0.25); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
        .blink { animation: blink 1.4s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${t.border}`, background: t.surface,
        padding: "0 40px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50, boxShadow: t.shadow,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={e=>window.location.href="/"}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: t.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
            fontSize: 15, color: "#fff",
          }}>Q</div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.2px" }}>Quantiva</span>
          <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'DM Mono', monospace", marginLeft: 2 }}>v3.0</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>EMA · SMA · RSI</span>
          <button className="theme-btn" onClick={() => setIsDark(!isDark)}>
            <span>{isDark ? "☀" : "☽"}</span>
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 28px 80px" }}>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 400, letterSpacing: "-0.3px", color: t.text, marginBottom: 8 }}>
            Stock Analysis
          </h1>
          <p style={{ fontSize: 13, color: t.textSub, maxWidth: 460, lineHeight: 1.65 }}>
            Select a ticker and date range to run EMA, SMA, and RSI analysis across a distributed microservices backend.
          </p>
        </div>

        {/* Controls */}
        <div className="card-hover" style={{
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 12, padding: "22px 24px", marginBottom: 20,
          boxShadow: t.shadow,
        }}>
          <p style={{ fontSize: 10, color: t.textMuted, letterSpacing: "0.8px", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 16 }}>
            Parameters
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 170px 170px auto", gap: 12, alignItems: "end" }}>

            {/* Ticker */}
            <div ref={dropRef} style={{ position: "relative" }}>
              <p style={{ fontSize: 10, color: t.textMuted, marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>TICKER</p>
              <div onClick={() => setDropOpen(true)} style={{
                background: t.bg, border: `1px solid ${t.border}`,
                borderRadius: 8, padding: "11px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                {selected ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 5,
                      background: t.accentBg, border: `1px solid ${t.accentBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, fontWeight: 600, color: t.accent,
                      fontFamily: "'DM Mono', monospace",
                    }}>{selected.symbol.slice(0, 2)}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono', monospace", color: t.text }}>{selected.symbol}</div>
                      <div style={{ fontSize: 10, color: t.textMuted }}>{selected.name}</div>
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: t.textMuted }}>Search or select...</span>
                )}
                <span style={{ color: t.textMuted, fontSize: 10 }}>▾</span>
              </div>

              {dropOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                  background: t.surface, border: `1px solid ${t.border}`,
                  borderRadius: 10, zIndex: 200, boxShadow: t.shadowMd, overflow: "hidden",
                }}>
                  <div style={{ padding: "9px 13px", borderBottom: `1px solid ${t.border}` }}>
                    <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                      placeholder="e.g. AAPL or Apple"
                      style={{ width: "100%", background: "transparent", border: "none", color: t.text, fontSize: 12, fontFamily: "'DM Mono', monospace", outline: "none" }}
                    />
                  </div>
                  <div style={{ maxHeight: 256, overflowY: "auto" }}>
                    {filtered.map(tk => (
                      <div key={tk.symbol} className="ticker-row"
                        onClick={() => { setSelected(tk); setDropOpen(false); setQuery(""); }}
                        style={{ padding: "9px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, borderBottom: `1px solid ${t.border}`, transition: "background 0.1s" }}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: 5, background: t.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 600, color: t.accent, fontFamily: "'DM Mono', monospace" }}>
                          {tk.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono', monospace", color: t.text }}>{tk.symbol}</div>
                          <div style={{ fontSize: 10, color: t.textMuted }}>{tk.name}</div>
                        </div>
                      </div>
                    ))}
                    {!filtered.length && (
                      <div style={{ padding: "18px 14px", color: t.textMuted, fontSize: 12, textAlign: "center" }}>No results</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dates */}
            {[["FROM", startDate, setStartDate], ["TO", endDate, setEndDate]].map(([lbl, val, setter]) => (
              <div key={lbl}>
                <p style={{ fontSize: 10, color: t.textMuted, marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>{lbl}</p>
                <input type="date" value={val} onChange={e => setter(e.target.value)} style={{
                  background: t.bg, border: `1px solid ${t.border}`,
                  borderRadius: 8, padding: "11px 14px", color: t.text,
                  fontFamily: "'DM Mono', monospace", fontSize: 12,
                  colorScheme: isDark ? "dark" : "light", width: "100%",
                }} />
              </div>
            ))}

            <div>
              <p style={{ fontSize: 10, opacity: 0, marginBottom: 6 }}>run</p>
              <button className="btn-run" onClick={analyze} disabled={!selected || loading} style={{ width: "100%" }}>
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}><span className="spinner" /> Running…</span>
                  : "Run Analysis →"
                }
              </button>
            </div>
          </div>
        </div>

        {/* Wake-up progress */}
        {loading && wakeStep >= 0 && (
          <div className="fade-up" style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: "22px 24px", marginBottom: 20,
            boxShadow: t.shadow,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div className="blink" style={{ width: 7, height: 7, borderRadius: "50%", background: t.amber, flexShrink: 0 }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Analysis running</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {WAKE_STEPS.map((step, i) => {
                const done = i < wakeStep;
                const active = i === wakeStep;
                return (
                  <div key={step.id} style={{ display: "flex", gap: 14, position: "relative" }}>
                    {i < WAKE_STEPS.length - 1 && (
                      <div style={{
                        position: "absolute", left: 12, top: 26, bottom: -4,
                        width: 1.5, background: done ? t.accent : t.border,
                        transition: "background 0.4s",
                      }} />
                    )}
                    <div style={{ flexShrink: 0, marginTop: 1 }}>
                      <div style={{
                        width: 25, height: 25, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 600,
                        background: done ? t.accentBg : active ? t.amberBg : t.surfaceAlt,
                        border: `1.5px solid ${done ? t.accent : active ? t.amber : t.border}`,
                        color: done ? t.accent : active ? t.amber : t.textMuted,
                        transition: "all 0.3s",
                      }}>
                        {done ? "✓" : i + 1}
                      </div>
                    </div>
                    <div style={{ paddingBottom: 18, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: active ? 8 : 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: i > wakeStep ? t.textMuted : t.text, transition: "color 0.3s" }}>
                          {step.label}
                        </p>
                        {active && (
                          <span style={{ fontSize: 10, color: t.amber, fontFamily: "'DM Mono', monospace" }}>
                            {step.eta}
                          </span>
                        )}
                      </div>
                      {active && (
                        <div style={{
                          background: t.amberBg, border: `1px solid ${t.amberBorder}`,
                          borderRadius: 8, padding: "10px 14px",
                          fontSize: 12, color: t.textSub, lineHeight: 1.65, maxWidth: 560,
                        }}>
                          {step.detail}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: t.redBg, border: `1px solid ${t.redBorder}`,
            borderRadius: 10, padding: "14px 18px", marginBottom: 20,
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <span style={{ color: t.red, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✕</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: t.red, marginBottom: 3 }}>Analysis failed</p>
              <p style={{ fontSize: 12, color: t.red, opacity: 0.75, marginBottom: 6 }}>{error}</p>
              <p style={{ fontSize: 11, color: t.textMuted }}>
                The servers may still be waking up. Wait 30 seconds and try again — it should work on the second attempt.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="fade-up">

            {/* Stock header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 16, paddingBottom: 20, marginBottom: 20,
              borderBottom: `1px solid ${t.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: t.accentBg, border: `1px solid ${t.accentBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 14, color: t.accent,
                }}>{selected?.symbol.slice(0, 2)}</div>
                <div>
                  <h2 style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 20, lineHeight: 1, color: t.text }}>{selected?.symbol}</h2>
                  <p style={{ fontSize: 12, color: t.textSub, marginTop: 3 }}>{selected?.name}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                {latestClose && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, color: t.text, lineHeight: 1 }}>
                      ${latestClose.toFixed(2)}
                    </div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>Latest close</div>
                  </div>
                )}
                {priceChange !== null && (
                  <div style={{
                    padding: "8px 16px", borderRadius: 8,
                    background: isUp ? t.accentBg : t.redBg,
                    border: `1px solid ${isUp ? t.accentBorder : t.redBorder}`,
                    textAlign: "center",
                  }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 18, color: isUp ? t.accent : t.red }}>
                      {isUp ? "+" : ""}{priceChange}%
                    </div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>Period return</div>
                  </div>
                )}
              </div>
            </div>

            {/* Indicator cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
              {[
                {
                  id: "ema", label: "EMA", name: "Exponential Moving Average",
                  value: ema?.result, accent: t.accent,
                  badge: ema?.result && latestClose ? { label: latestClose > ema.result ? "Price above" : "Price below", color: latestClose > ema.result ? t.accent : t.red } : null,
                  hint: "Weights recent prices more heavily than older ones. A price above EMA is generally considered a bullish signal.",
                },
                {
                  id: "sma", label: "SMA", name: "Simple Moving Average",
                  value: sma?.result, accent: t.blue,
                  badge: sma?.result && latestClose ? { label: latestClose > sma.result ? "Price above" : "Price below", color: latestClose > sma.result ? t.blue : t.red } : null,
                  hint: "Averages all prices equally over the period. Slower to react than EMA but less noise.",
                },
                {
                  id: "rsi", label: "RSI", name: "Relative Strength Index",
                  value: rsi?.result, accent: rsiColor,
                  badge: rsiState ? {
                    label: rsiState === "overbought" ? "Overbought (>70)" : rsiState === "oversold" ? "Oversold (<30)" : "Neutral (30–70)",
                    color: rsiColor,
                  } : null,
                  hint: rsiState === "overbought"
                    ? "Above 70 — the stock may be overvalued. Some traders take this as a sell signal."
                    : rsiState === "oversold"
                    ? "Below 30 — the stock may be undervalued. Often seen as a potential buying opportunity."
                    : "Between 30–70, which indicates no extreme momentum in either direction.",
                },
              ].map(ind => (
                <div key={ind.id} className="card-hover" style={{
                  background: t.surface, border: `1px solid ${t.border}`,
                  borderRadius: 12, padding: "20px 22px", boxShadow: t.shadow,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: t.textMuted, letterSpacing: "0.8px" }}>{ind.label}</span>
                    {ind.badge && (
                      <span style={{
                        fontSize: 9, fontFamily: "'DM Mono', monospace",
                        padding: "2px 8px", borderRadius: 4,
                        background: `${ind.badge.color}18`, color: ind.badge.color,
                        border: `1px solid ${ind.badge.color}28`,
                        whiteSpace: "nowrap",
                      }}>{ind.badge.label}</span>
                    )}
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: ind.accent, lineHeight: 1, marginBottom: 4 }}>
                    {ind.value != null ? Number(ind.value).toFixed(2) : "—"}
                  </div>
                  <div style={{ fontSize: 11, color: t.textSub, marginBottom: 10 }}>{ind.name}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.6, borderTop: `1px solid ${t.border}`, paddingTop: 10 }}>
                    {ind.hint}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="card-hover" style={{
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 12, padding: "24px 28px", marginBottom: 14,
                boxShadow: t.shadow,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                  <div>
                    <p style={{ fontSize: 10, color: t.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 5 }}>PRICE CHART — CLOSE</p>
                    <h3 style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 15, color: t.text }}>
                      {selected?.symbol} · {candles.length} sessions
                    </h3>
                  </div>
                  <div style={{ display: "flex", gap: 18 }}>
                    {[
                      { color: t.accent, label: `EMA ${ema?.result?.toFixed(1)}` },
                      { color: t.blue, label: `SMA ${sma?.result?.toFixed(1)}` },
                    ].map(l => (
                      <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="18" height="6" style={{ flexShrink: 0 }}>
                          <line x1="0" y1="3" x2="18" y2="3" stroke={l.color} strokeWidth="1.5" strokeDasharray="4 3" />
                        </svg>
                        <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={270}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 8 }}>
                    <defs>
                      <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.chartStroke} stopOpacity="0.1" />
                        <stop offset="100%" stopColor={t.chartStroke} stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={t.border} strokeDasharray="0" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: t.textMuted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={{ stroke: t.border }} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: t.textMuted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v.toFixed(0)}`} width={54} domain={[chartMin, chartMax]} />
                    <Tooltip content={<CustomTooltip t={t} />} />
                    {ema?.result && <ReferenceLine y={ema.result} stroke={t.accent} strokeDasharray="4 3" strokeWidth={1.5} strokeOpacity={0.55} />}
                    {sma?.result && <ReferenceLine y={sma.result} stroke={t.blue} strokeDasharray="4 3" strokeWidth={1.5} strokeOpacity={0.55} />}
                    <Area type="monotone" dataKey="close" stroke={t.chartStroke} strokeWidth={2} fill="url(#fill)" dot={false} activeDot={{ r: 4, fill: t.chartStroke, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* OHLCV table */}
            {candles.length > 0 && (
              <div className="card-hover" style={{
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 12, padding: "22px 24px", overflowX: "auto",
                boxShadow: t.shadow,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontSize: 10, color: t.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.8px" }}>
                    OHLCV — LAST 10 SESSIONS
                  </p>
                  <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>{candles.length} total</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${t.border}` }}>
                      {["Date", "Open", "High", "Low", "Close", "Volume"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "6px 12px 10px", fontSize: 10, color: t.textMuted, fontWeight: 500, fontFamily: "'DM Mono', monospace", letterSpacing: "0.5px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {candles.slice(-10).map((c, i) => {
                      const up = c.close >= c.open;
                      return (
                        <tr key={i} className="tr-hover" style={{ borderBottom: `1px solid ${t.border}` }}>
                          <td style={{ padding: "10px 12px", fontSize: 11, color: t.textSub, fontFamily: "'DM Mono', monospace" }}>
                            {new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: 11, color: t.text, fontFamily: "'DM Mono', monospace" }}>${c.open?.toFixed(2)}</td>
                          <td style={{ padding: "10px 12px", fontSize: 11, color: t.accent, fontFamily: "'DM Mono', monospace" }}>${c.high?.toFixed(2)}</td>
                          <td style={{ padding: "10px 12px", fontSize: 11, color: t.red, fontFamily: "'DM Mono', monospace" }}>${c.low?.toFixed(2)}</td>
                          <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono', monospace", color: up ? t.accent : t.red }}>
                            <span style={{ fontSize: 8, marginRight: 5, opacity: 0.6 }}>{up ? "▲" : "▼"}</span>
                            ${c.close?.toFixed(2)}
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: 11, color: t.textSub, fontFamily: "'DM Mono', monospace" }}>
                            {c.volume >= 1e9 ? `${(c.volume / 1e9).toFixed(2)}B` : `${(c.volume / 1e6).toFixed(1)}M`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!data && !loading && (
          <div style={{ textAlign: "center", padding: "72px 0 40px" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: t.surfaceAlt, border: `1px solid ${t.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
              fontSize: 22, color: t.textMuted, margin: "0 auto 18px",
            }}>Q</div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, color: t.textSub, marginBottom: 8 }}>
              Select a ticker to get started
            </h3>
            <p style={{ fontSize: 12, color: t.textMuted, maxWidth: 340, margin: "0 auto", lineHeight: 1.65 }}>
              Pick a company, set a date range, and click <strong style={{ color: t.textSub }}>Run Analysis</strong>. You'll get EMA, SMA, RSI indicators and a full OHLCV price chart.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}