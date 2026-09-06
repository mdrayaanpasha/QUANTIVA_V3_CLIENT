import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from "recharts";
import Beams from "../home/Beams"; // Added Beams background

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

const API_BASE = "https://api-quantiva.rayaanpasha.dev";

const WAKE_STEPS = [
  {
    id: "ping",
    label: "Waking up the backend servers",
    eta: "~30–60 sec",
    detail: "Quantiva runs on Render's free hosting tier, which automatically shuts down idle servers after 15 minutes. Your request triggered a cold start — all 4 microservices are booting up. This only happens on the first request.",
  },
  {
    id: "queue",
    label: "Servers online — connecting job queue",
    eta: "~3 sec",
    detail: "All 4 services are responding. Initialising RabbitMQ message broker to route analysis jobs to the right workers.",
  },
  {
    id: "workers",
    label: "Running analysis workers in parallel",
    eta: "~5 sec",
    detail: "Three independent workers are now running simultaneously — one each for EMA, SMA, and RSI.",
  },
];

// Unified premium dark theme
const t = {
  bg: "#0A0A0A",
  glass: "rgba(25, 25, 25, 0.4)",
  glassHover: "rgba(35, 35, 35, 0.5)",
  surface: "#121212",
  border: "rgba(255, 255, 255, 0.08)",
  borderStrong: "rgba(255, 255, 255, 0.15)",
  text: "#EDEDED",
  textSub: "#A1A1AA",
  textMuted: "#737373",
  accent: "#FFFFFF",
  accentGlow: "rgba(255, 255, 255, 0.05)",
  shadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  green: "#10b981",
  red: "#ef4444",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="glass-panel" style={{
      padding: "16px", borderRadius: "12px", minWidth: 160,
    }}>
      <p style={{ color: t.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>{label}</p>
      <p style={{ color: t.text, fontWeight: 500, fontSize: 18, marginBottom: 12 }}>
        ${Number(payload[0].value).toFixed(2)}
      </p>
      {d && (
        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
          {[["O", d.open], ["H", d.high], ["L", d.low], ["Vol", d.volume]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: t.textSub }}>
              <span>{k}</span>
              <span style={{ color: t.text }}>{k === "Vol" ? `${(v / 1e6).toFixed(0)}M` : `$${Number(v).toFixed(2)}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Analysis() {
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
      fetch("https://api-quantiva.rayaanpasha.dev/health"),
      fetch("https://api-quantiva.rayaanpasha.dev/health"),
      fetch("https://api-quantiva.rayaanpasha.dev/health"),
      fetch("https://api-quantiva.rayaanpasha.dev/health"),
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
  const rsiColor = rsiState === "overbought" ? t.red : rsiState === "oversold" ? t.green : t.textSub;

  const latestClose = candles.at(-1)?.close;
  const firstClose = candles[0]?.close;
  const priceChange = latestClose && firstClose
    ? ((latestClose - firstClose) / firstClose * 100).toFixed(2) : null;
  const isUp = Number(priceChange) >= 0;

  const chartMin = chartData.length ? Math.min(...chartData.map(d => d.close)) * 0.993 : "auto";
  const chartMax = chartData.length ? Math.max(...chartData.map(d => d.close)) * 1.007 : "auto";

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: t.text, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1 }}>
        <Beams backgroundColor={t.bg} beamColor="#000000" lightColor="#000000" lightMode={false} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${t.text}; color: ${t.bg}; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.borderStrong}; border-radius: 4px; }
        
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; filter: invert(1); }
        
        .glass-panel {
          background: ${t.glass};
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid ${t.border};
          box-shadow: ${t.shadow};
        }
        
        .glass-input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid ${t.border};
          color: ${t.text};
          transition: all 0.2s ease;
        }
        .glass-input:focus, .glass-input:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: ${t.borderStrong};
          outline: none;
        }

        .ticker-row { transition: background 0.15s; }
        .ticker-row:hover { background: rgba(255, 255, 255, 0.05); }
        
        .btn-primary {
          background: ${t.text}; color: ${t.bg}; border: none; border-radius: 99px;
          padding: 12px 24px; font-family: 'Inter', sans-serif; font-size: 13px;
          font-weight: 500; cursor: pointer; display: inline-flex; justify-content: center;
          align-items: center; gap: 8px; transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .btn-primary:hover:not(:disabled) { transform: scale(0.98); opacity: 0.9; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .spinner { display:inline-block; width:14px; height:14px; border:2px solid rgba(0,0,0,0.2); border-top-color:#000; border-radius:50%; animation:spin 0.6s linear infinite; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {/* Floating Navigation */}
      <nav className="glass-panel" style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 32px)", maxWidth: 1080, height: 56, borderRadius: 99,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => window.location.href = "/"}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.text }} />
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.3px" }}>Quantiva</span>
          <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace", padding: "2px 6px", borderRadius: 99, background: t.accentGlow }}>v3.0</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: t.textSub, fontFamily: "'JetBrains Mono', monospace" }}>EMA · SMA · RSI</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "120px 24px 80px" }}>
        
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.03em", color: t.text, marginBottom: 12 }}>
            Market Analysis
          </h1>
          <p style={{ fontSize: 15, color: t.textSub, maxWidth: 500, lineHeight: 1.6 }}>
            Select a ticker and date range. The orchestrator will dispatch EMA, SMA, and RSI jobs simultaneously.
          </p>
        </div>

        {/* Controls Panel */}
        <div className="glass-panel fade-up" style={{ borderRadius: 24, padding: 32, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 180px auto", gap: 16, alignItems: "end" }}>
            
            {/* Ticker Selector */}
            <div ref={dropRef} style={{ position: "relative" }}>
              <p style={{ fontSize: 11, color: t.textMuted, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>TICKER</p>
              <div onClick={() => setDropOpen(true)} className="glass-input" style={{
                borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between", height: 48,
              }}>
                {selected ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", color: t.text }}>{selected.symbol}</div>
                    <div style={{ fontSize: 12, color: t.textMuted }}>{selected.name}</div>
                  </div>
                ) : (
                  <span style={{ fontSize: 13, color: t.textMuted }}>Select asset...</span>
                )}
                <span style={{ color: t.textMuted, fontSize: 10 }}>▼</span>
              </div>

              {dropOpen && (
                <div className="glass-panel" style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
                  borderRadius: 16, zIndex: 200, overflow: "hidden",
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}` }}>
                    <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                      placeholder="Search symbol or name..."
                      style={{ width: "100%", background: "transparent", border: "none", color: t.text, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none" }}
                    />
                  </div>
                  <div style={{ maxHeight: 260, overflowY: "auto" }}>
                    {filtered.map(tk => (
                      <div key={tk.symbol} className="ticker-row"
                        onClick={() => { setSelected(tk); setDropOpen(false); setQuery(""); }}
                        style={{ padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${t.border}` }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", color: t.text, width: 48 }}>{tk.symbol}</div>
                        <div style={{ fontSize: 12, color: t.textSub }}>{tk.name}</div>
                      </div>
                    ))}
                    {!filtered.length && <div style={{ padding: "24px", color: t.textMuted, fontSize: 13, textAlign: "center" }}>No matches found</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Date Inputs */}
            {[["START", startDate, setStartDate], ["END", endDate, setEndDate]].map(([lbl, val, setter]) => (
              <div key={lbl}>
                <p style={{ fontSize: 11, color: t.textMuted, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>{lbl}</p>
                <input type="date" value={val} onChange={e => setter(e.target.value)} className="glass-input" style={{
                  borderRadius: 12, padding: "0 16px", color: t.text, height: 48,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                  colorScheme: "dark", width: "100%",
                }} />
              </div>
            ))}

            <div>
              <button className="btn-primary" onClick={analyze} disabled={!selected || loading} style={{ height: 48, width: "100%" }}>
                {loading ? <><span className="spinner" /> Computing</> : "Run Analysis"}
              </button>
            </div>
          </div>
        </div>

        {/* Wake-up Sequence */}
        {loading && wakeStep >= 0 && (
          <div className="glass-panel fade-up" style={{ borderRadius: 24, padding: 32, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent }} />
              <p style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Orchestrating microservices...</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {WAKE_STEPS.map((step, i) => {
                const done = i < wakeStep;
                const active = i === wakeStep;
                return (
                  <div key={step.id} style={{ display: "flex", gap: 16, position: "relative" }}>
                    {i < WAKE_STEPS.length - 1 && (
                      <div style={{
                        position: "absolute", left: 13, top: 28, bottom: -4,
                        width: 1, background: done ? t.text : t.border,
                      }} />
                    )}
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        background: done ? t.text : active ? t.accentGlow : "transparent",
                        border: `1px solid ${done ? t.text : active ? t.borderStrong : t.border}`,
                        color: done ? t.bg : active ? t.text : t.textMuted,
                        transition: "all 0.3s ease",
                      }}>
                        {done ? "✓" : i + 1}
                      </div>
                    </div>
                    <div style={{ paddingBottom: 24, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: active ? 8 : 0, marginTop: 6 }}>
                        <p style={{ fontSize: 14, color: i > wakeStep ? t.textMuted : t.text }}>{step.label}</p>
                        {active && <span style={{ fontSize: 11, color: t.textSub, fontFamily: "'JetBrains Mono', monospace" }}>{step.eta}</span>}
                      </div>
                      {active && (
                        <div style={{
                          background: "rgba(255,255,255,0.02)", border: `1px solid ${t.border}`,
                          borderRadius: 12, padding: "16px",
                          fontSize: 13, color: t.textSub, lineHeight: 1.6, maxWidth: 600,
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

        {/* Error State */}
        {error && (
          <div className="glass-panel fade-up" style={{ borderRadius: 16, padding: "20px 24px", marginBottom: 24, borderLeft: `4px solid ${t.red}` }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 4 }}>Analysis Failed</p>
            <p style={{ fontSize: 13, color: t.textSub }}>{error}. Give it a few seconds for the cold start and try again.</p>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="fade-up">
            
            {/* Asset Header */}
            <div className="glass-panel" style={{ borderRadius: 24, padding: "32px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: t.text, color: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 16 }}>
                    {selected?.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em" }}>{selected?.name}</h2>
                    <p style={{ fontSize: 13, color: t.textSub, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{selected?.symbol}</p>
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                {latestClose && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 32, fontWeight: 500 }}>${latestClose.toFixed(2)}</div>
                    <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>Latest Close</div>
                  </div>
                )}
                {priceChange !== null && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: isUp ? t.green : t.red }}>
                      {isUp ? "+" : ""}{priceChange}%
                    </div>
                    <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>Period Return</div>
                  </div>
                )}
              </div>
            </div>

            {/* Indicators Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24 }}>
              {[
                { id: "ema", label: "EMA", name: "Exponential Moving Average", value: ema?.result, badge: ema?.result && latestClose ? (latestClose > ema.result ? "Bullish" : "Bearish") : null },
                { id: "sma", label: "SMA", name: "Simple Moving Average", value: sma?.result, badge: sma?.result && latestClose ? (latestClose > sma.result ? "Above SMA" : "Below SMA") : null },
                { id: "rsi", label: "RSI", name: "Relative Strength Index", value: rsi?.result, badge: rsiState === "overbought" ? "Overbought" : rsiState === "oversold" ? "Oversold" : "Neutral", badgeColor: rsiColor },
              ].map(ind => (
                <div key={ind.id} className="glass-panel" style={{ borderRadius: 20, padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: t.textSub }}>{ind.label}</span>
                    {ind.badge && (
                      <span style={{
                        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        padding: "4px 10px", borderRadius: 99,
                        background: ind.badgeColor ? `${ind.badgeColor}15` : t.accentGlow, 
                        color: ind.badgeColor || t.textSub,
                        border: `1px solid ${ind.badgeColor ? `${ind.badgeColor}30` : t.border}`,
                      }}>{ind.badge}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 500, marginBottom: 8, color: ind.badgeColor || t.text }}>
                    {ind.value != null ? Number(ind.value).toFixed(2) : "—"}
                  </div>
                  <div style={{ fontSize: 13, color: t.textMuted }}>{ind.name}</div>
                </div>
              ))}
            </div>

            {/* Chart Panel */}
            {chartData.length > 0 && (
              <div className="glass-panel" style={{ borderRadius: 24, padding: "32px 32px 16px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Price Action</h3>
                    <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{candles.length} SESSIONS</p>
                  </div>
                  <div style={{ display: "flex", gap: 24 }}>
                    {[
                      { color: t.text, label: `EMA ${ema?.result?.toFixed(2)}` },
                      { color: t.textSub, label: `SMA ${sma?.result?.toFixed(2)}` },
                    ].map(l => (
                      <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="24" height="2" style={{ flexShrink: 0 }}>
                          <line x1="0" y1="1" x2="24" y2="1" stroke={l.color} strokeWidth="2" strokeDasharray="4 4" />
                        </svg>
                        <span style={{ fontSize: 11, color: t.textSub, fontFamily: "'JetBrains Mono', monospace" }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.text} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={t.text} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={t.border} strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: t.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} dy={16} />
                    <YAxis tick={{ fill: t.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v.toFixed(0)}`} width={60} domain={[chartMin, chartMax]} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: t.borderStrong, strokeWidth: 1, strokeDasharray: "4 4" }} />
                    {ema?.result && <ReferenceLine y={ema.result} stroke={t.text} strokeDasharray="4 4" strokeWidth={1.5} opacity={0.5} />}
                    {sma?.result && <ReferenceLine y={sma.result} stroke={t.textSub} strokeDasharray="4 4" strokeWidth={1.5} opacity={0.5} />}
                    <Area type="monotone" dataKey="close" stroke={t.text} strokeWidth={2} fill="url(#fill)" dot={false} activeDot={{ r: 4, fill: t.bg, stroke: t.text, strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* OHLCV Table */}
            {candles.length > 0 && (
              <div className="glass-panel" style={{ borderRadius: 24, padding: "32px", overflowX: "auto" }}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Raw Metrics</h3>
                  <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>LAST 10 SESSIONS</p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${t.borderStrong}` }}>
                      {["Date", "Open", "High", "Low", "Close", "Volume"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "0 16px 16px", fontSize: 11, color: t.textSub, fontWeight: 400, fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {candles.slice(-10).map((c, i) => {
                      const up = c.close >= c.open;
                      return (
                        <tr key={i} className="ticker-row" style={{ borderBottom: `1px solid ${t.border}` }}>
                          <td style={{ padding: "16px", fontSize: 12, color: t.textSub, fontFamily: "'JetBrains Mono', monospace" }}>
                            {new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                          </td>
                          <td style={{ padding: "16px", fontSize: 12, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>${c.open?.toFixed(2)}</td>
                          <td style={{ padding: "16px", fontSize: 12, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>${c.high?.toFixed(2)}</td>
                          <td style={{ padding: "16px", fontSize: 12, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>${c.low?.toFixed(2)}</td>
                          <td style={{ padding: "16px", fontSize: 12, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", color: up ? t.green : t.red }}>
                            ${c.close?.toFixed(2)}
                          </td>
                          <td style={{ padding: "16px", fontSize: 12, color: t.textSub, fontFamily: "'JetBrains Mono', monospace" }}>
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

        {/* Empty State */}
        {!data && !loading && (
          <div style={{ textAlign: "center", padding: "100px 0 40px" }}>
            <h3 style={{ fontSize: 24, fontWeight: 500, color: t.text, marginBottom: 12 }}>
              Awaiting parameters
            </h3>
            <p style={{ fontSize: 14, color: t.textSub, maxWidth: 360, margin: "0 auto", lineHeight: 1.6 }}>
              Select a ticker from the dropdown above to initialize the parallel analysis workers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}