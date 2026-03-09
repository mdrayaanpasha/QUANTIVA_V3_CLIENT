import { useState, useEffect, useRef } from "react";

const themes = {
  light: {
    bg: "#f8f8f6",
    surface: "#ffffff",
    surfaceAlt: "#f3f3f0",
    surfaceRaised: "#ffffff",
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
    blue: "#2563eb",
    blueBg: "#eff6ff",
    blueBorder: "#bfdbfe",
    amber: "#b45309",
    amberBg: "#fffbeb",
    amberBorder: "#fde68a",
    shadow: "0 1px 2px rgba(0,0,0,0.05)",
    shadowMd: "0 4px 14px rgba(0,0,0,0.07)",
    shadowLg: "0 12px 40px rgba(0,0,0,0.09)",
    codeBase: "#f3f3f0",
    codeBorder: "#e0e0d8",
  },
  dark: {
    bg: "#111110",
    surface: "#1c1c1a",
    surfaceAlt: "#242422",
    surfaceRaised: "#222220",
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
    blue: "#60a5fa",
    blueBg: "rgba(96,165,250,0.07)",
    blueBorder: "rgba(96,165,250,0.2)",
    amber: "#fbbf24",
    amberBg: "rgba(251,191,36,0.07)",
    amberBorder: "rgba(251,191,36,0.2)",
    shadow: "0 1px 3px rgba(0,0,0,0.25)",
    shadowMd: "0 4px 16px rgba(0,0,0,0.4)",
    shadowLg: "0 12px 40px rgba(0,0,0,0.5)",
    codeBase: "#181816",
    codeBorder: "#2a2a26",
  },
};

// Simple architecture diagram as SVG
const ArchDiagram = ({ t }) => {
  const node = (label, sub, x, y, color, isMain) => (
    <g key={label} transform={`translate(${x},${y})`}>
      <rect
        x={isMain ? -52 : -44} y={-22}
        width={isMain ? 104 : 88} height={44}
        rx={8}
        fill={isMain ? color + "15" : t.surfaceAlt}
        stroke={isMain ? color : t.border}
        strokeWidth={isMain ? 1.5 : 1}
      />
      <text textAnchor="middle" y={-5} fontSize={11} fontFamily="'DM Mono', monospace" fontWeight={600} fill={isMain ? color : t.text}>
        {label}
      </text>
      <text textAnchor="middle" y={10} fontSize={9} fontFamily="'DM Mono', monospace" fill={t.textMuted}>
        {sub}
      </text>
    </g>
  );

  const arrow = (x1, y1, x2, y2, dashed) => (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={t.borderStrong}
      strokeWidth={1.5}
      strokeDasharray={dashed ? "4 3" : "0"}
      markerEnd="url(#arr)"
    />
  );

  return (
    <svg viewBox="0 0 700 220" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={t.borderStrong} />
        </marker>
      </defs>

      {/* Client */}
      {node("Client", "Browser", 70, 110, t.blue, true)}

      {/* Orchestrator */}
      {node("Orchestrator", "Service 1", 230, 110, t.accent, true)}

      {/* Redis */}
      {node("Redis", "Cache", 230, 190, t.amber, false)}

      {/* RabbitMQ */}
      {node("RabbitMQ", "Message Bus", 420, 110, t.red, true)}

      {/* Workers */}
      {node("EMA", "Worker", 590, 50, t.accent, false)}
      {node("SMA", "Worker", 590, 110, t.blue, false)}
      {node("RSI", "Worker", 590, 170, t.amber, false)}

      {/* Arrows */}
      {arrow(122, 110, 178, 110, false)}
      {arrow(282, 110, 372, 110, false)}
      {arrow(230, 132, 230, 168, false)}
      {arrow(468, 74, 546, 60, false)}
      {arrow(468, 110, 546, 110, false)}
      {arrow(468, 146, 546, 160, false)}

      {/* Return arrows (dashed) */}
      {arrow(546, 54, 468, 100, true)}
      {arrow(546, 116, 468, 116, true)}
      {arrow(546, 166, 468, 120, true)}
      {arrow(372, 104, 282, 104, true)}
      {arrow(178, 104, 122, 104, true)}

      {/* Labels */}
      <text x={148} y={103} fontSize={8} fontFamily="'DM Mono', monospace" fill={t.textMuted} textAnchor="middle">HTTP</text>
      <text x={327} y={103} fontSize={8} fontFamily="'DM Mono', monospace" fill={t.textMuted} textAnchor="middle">publish</text>
      <text x={244} y={155} fontSize={8} fontFamily="'DM Mono', monospace" fill={t.textMuted}>cache</text>
      <text x={500} y={48} fontSize={8} fontFamily="'DM Mono', monospace" fill={t.textMuted} textAnchor="middle">consume</text>
      <text x={500} y={105} fontSize={8} fontFamily="'DM Mono', monospace" fill={t.textMuted} textAnchor="middle">consume</text>
      <text x={500} y={162} fontSize={8} fontFamily="'DM Mono', monospace" fill={t.textMuted} textAnchor="middle">consume</text>
    </svg>
  );
};

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const t = themes[isDark ? "dark" : "light"];
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.id]: true }));
      }),
      { threshold: 0.12 }
    );
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const reveal = (id) => ({
    ref: el => refs.current[id] = el,
    "data-id": id,
    style: {
      opacity: visible[id] ? 1 : 0,
      transform: visible[id] ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }
  });

  const mono = { fontFamily: "'DM Mono', monospace" };
  const serif = { fontFamily: "'Instrument Serif', serif" };

  const Tag = ({ children, color }) => (
    <span style={{
      fontSize: 10, ...mono, fontWeight: 500,
      padding: "3px 9px", borderRadius: 4,
      background: (color || t.accent) + "18",
      color: color || t.accent,
      border: `1px solid ${(color || t.accent)}28`,
    }}>{children}</span>
  );

  const CodeLine = ({ children, indent = 0, color }) => (
    <div style={{ paddingLeft: indent * 16, color: color || t.textSub, fontSize: 11, lineHeight: 1.8, ...mono }}>
      {children}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
        html { scroll-behavior: smooth; }
        .theme-btn {
          background: ${t.surfaceAlt}; border: 1px solid ${t.border}; border-radius: 20px;
          padding: 5px 14px; cursor: pointer; font-family: 'DM Mono', monospace;
          font-size: 11px; color: ${t.textSub}; display: flex; align-items: center; gap: 6px;
          transition: background 0.15s;
        }
        .theme-btn:hover { background: ${t.border}; }
        .nav-link {
          font-size: 13px; color: ${t.textSub}; text-decoration: none;
          transition: color 0.15s; cursor: pointer;
        }
        .nav-link:hover { color: ${t.text}; }
        .cta-btn {
          background: ${t.accent}; color: #fff; border: none; border-radius: 8px;
          padding: 12px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block;
          transition: filter 0.15s, transform 0.1s, box-shadow 0.15s;
        }
        .cta-btn:hover { filter: brightness(1.07); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(5,150,105,0.22); }
        .cta-btn:active { transform: translateY(0); }
        .cta-ghost {
          background: transparent; color: ${t.textSub}; border: 1px solid ${t.border};
          border-radius: 8px; padding: 12px 28px; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none;
          display: inline-block; transition: border-color 0.15s, color 0.15s;
        }
        .cta-ghost:hover { border-color: ${t.borderStrong}; color: ${t.text}; }
        .card-h { transition: box-shadow 0.18s, border-color 0.18s; }
        .card-h:hover { border-color: ${t.borderStrong} !important; box-shadow: ${t.shadowMd} !important; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .blink { animation: blink 1.8s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .section { padding: 80px 28px; }
        .divider { height: 1px; background: ${t.border}; margin: 0 40px; }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        borderBottom: `1px solid ${t.border}`,
        background: t.surface, height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", position: "sticky", top: 0, zIndex: 50,
        boxShadow: t.shadow,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: t.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            ...serif, fontStyle: "italic", fontSize: 15, color: "#fff",
          }}>Q</div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.2px" }}>Quantiva</span>
          <span style={{ fontSize: 10, color: t.textMuted, ...mono, marginLeft: 2 }}>v3.0</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a className="nav-link" href="#architecture">Architecture</a>
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#notice">Hosting</a>
          
          <a className="cta-btn" href="/analysis" style={{ padding: "7px 18px", fontSize: 13 }}>
            Open App →
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "96px 28px 80px" }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: t.accentBg, border: `1px solid ${t.accentBorder}`,
            borderRadius: 20, padding: "4px 14px 4px 10px", marginBottom: 28,
          }}>
            <div className="blink" style={{ width: 6, height: 6, borderRadius: "50%", background: t.accent }} />
            <span style={{ fontSize: 11, color: t.accentText, ...mono }}>Student project · Live on Render</span>
          </div>

          <h1 style={{
            ...serif, fontSize: 60, fontWeight: 400,
            letterSpacing: "-1.5px", lineHeight: 1.0,
            color: t.text, marginBottom: 24,
          }}>
            Distributed<br />
            <em style={{ color: t.accent }}>Stock Analysis</em><br />
            Engine
          </h1>

          <p style={{ fontSize: 16, color: t.textSub, lineHeight: 1.75, maxWidth: 520, marginBottom: 36 }}>
            A systems engineering project demonstrating real-world distributed patterns — RabbitMQ RPC fan-out, Redis caching, and independent microservices computing EMA, SMA, and RSI in parallel.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="cta-btn" href="/analysis">Launch Analysis →</a>
            <a className="cta-ghost" href="#architecture">See how it works</a>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 40, flexWrap: "wrap" }}>
            {[
              { label: "4 microservices", sub: "independently deployed" },
              { label: "RabbitMQ RPC", sub: "fan-out pattern" },
              { label: "Redis cache", sub: "24-hour TTL" },
              { label: "100+ tickers", sub: "via Yahoo Finance" },
            ].map(s => (
              <div key={s.label} style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, ...mono }}>{s.label}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Render cold-start warning ── */}
      <section id="notice" style={{ maxWidth: 1080, margin: "0 auto" }} className="section">
        <div {...reveal("notice")}>
          <div style={{
            background: t.amberBg, border: `1px solid ${t.amberBorder}`,
            borderRadius: 12, padding: "24px 28px",
            display: "grid", gridTemplateColumns: "auto 1fr", gap: "20px 24px",
            alignItems: "start",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: t.amber + "20", border: `1px solid ${t.amberBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>⚠</div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 8 }}>
                Expect a 30–60 second wait on first use
              </h3>
              <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.7, maxWidth: 600, marginBottom: 14 }}>
                Quantiva is hosted on <strong style={{ color: t.text }}>Render's free tier</strong>, which automatically shuts down all servers after 15 minutes of inactivity to save resources. When you run your first analysis, all 4 microservices need to boot from scratch — this is called a <strong style={{ color: t.text }}>cold start</strong>.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { step: "01", title: "You click Run", body: "The app pings all 4 services simultaneously to trigger their boot sequence." },
                  { step: "02", title: "Services wake up", body: "Each service loads, connects to RabbitMQ, and signals it's ready. ~30–60 seconds." },
                  { step: "03", title: "Analysis runs", body: "Workers execute EMA, SMA, RSI in parallel. Results return in ~5 seconds." },
                ].map(s => (
                  <div key={s.step} style={{
                    background: t.surface, border: `1px solid ${t.border}`,
                    borderRadius: 8, padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: 9, color: t.amber, ...mono, marginBottom: 6, letterSpacing: "1px" }}>STEP {s.step}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.6 }}>{s.body}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: t.textMuted, marginTop: 12 }}>
                After the first run, the session stays warm and all subsequent analyses are fast. Refresh the page and the cycle repeats.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── What it does ── */}
      <section style={{ maxWidth: 1080, margin: "0 auto" }} className="section">
        <div {...reveal("what")}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 10, color: t.textMuted, ...mono, letterSpacing: "1px", marginBottom: 12 }}>WHAT IT DOES</p>
              <h2 style={{ ...serif, fontSize: 38, fontWeight: 400, letterSpacing: "-0.5px", color: t.text, lineHeight: 1.1, marginBottom: 18 }}>
                Technical indicator<br />analysis, distributed
              </h2>
              <p style={{ fontSize: 14, color: t.textSub, lineHeight: 1.75, marginBottom: 24 }}>
                Pick any of 100+ tickers, set a date range, and the system fetches OHLCV data, routes analysis jobs to three independent workers, and aggregates results back — all within a single request.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "EMA — Exponential Moving Average", body: "Weights recent prices more heavily. Faster to react to new trends than SMA.", color: t.accent },
                  { label: "SMA — Simple Moving Average", body: "Equal weight across all prices in the range. Less reactive, more stable baseline.", color: t.blue },
                  { label: "RSI — Relative Strength Index", body: "Momentum oscillator (0–100). Above 70 = overbought, below 30 = oversold.", color: t.amber },
                ].map(ind => (
                  <div key={ind.label} style={{
                    display: "flex", gap: 14,
                    padding: "14px 16px",
                    background: t.surface, border: `1px solid ${t.border}`,
                    borderRadius: 10, borderLeft: `3px solid ${ind.color}`,
                    boxShadow: t.shadow,
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 3, ...mono }}>{ind.label}</div>
                      <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.55 }}>{ind.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock result card */}
            <div style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 16, padding: "28px", boxShadow: t.shadowLg,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 18, borderBottom: `1px solid ${t.border}` }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 8, background: t.accentBg,
                  border: `1px solid ${t.accentBorder}`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 12, fontWeight: 600, color: t.accent, ...mono,
                }}>AP</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, ...mono, color: t.text }}>AAPL</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>Apple Inc.</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ ...serif, fontSize: 22, color: t.text }}>$237.87</div>
                  <div style={{ fontSize: 11, color: t.accent, ...mono }}>+2.4%</div>
                </div>
              </div>
              {[
                { label: "EMA", value: "236.38", hint: "Price above — bullish signal", color: t.accent },
                { label: "SMA", value: "237.65", hint: "Price below — mild caution", color: t.blue },
                { label: "RSI", value: "43.49", hint: "Neutral territory (30–70)", color: t.amber },
              ].map(ind => (
                <div key={ind.label} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: `1px solid ${t.border}`,
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, ...mono, letterSpacing: "0.8px", marginBottom: 3 }}>{ind.label}</div>
                    <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.4 }}>{ind.hint}</div>
                  </div>
                  <div style={{ ...serif, fontSize: 26, color: ind.color }}>{ind.value}</div>
                </div>
              ))}
              <div style={{ marginTop: 16, fontSize: 10, color: t.textMuted, ...mono, textAlign: "center" }}>
                Sample output — Jan 2025 · 20 sessions
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Architecture ── */}
      <section id="architecture" style={{ maxWidth: 1080, margin: "0 auto" }} className="section">
        <div {...reveal("arch-title")} style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, color: t.textMuted, ...mono, letterSpacing: "1px", marginBottom: 12 }}>SYSTEM ARCHITECTURE</p>
          <h2 style={{ ...serif, fontSize: 38, fontWeight: 400, letterSpacing: "-0.5px", color: t.text, lineHeight: 1.1, marginBottom: 16 }}>
            How it's built
          </h2>
          <p style={{ fontSize: 14, color: t.textSub, lineHeight: 1.7, maxWidth: 560 }}>
            A distributed system using the RabbitMQ RPC fan-out pattern. The orchestrator coordinates independent workers via message queues, correlating responses with UUIDs and aggregating results.
          </p>
        </div>

        {/* Diagram */}
        <div {...reveal("arch-diagram")} style={{
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 14, padding: "36px 24px", marginBottom: 24,
          boxShadow: t.shadow,
        }}>
          <ArchDiagram t={t} />
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { color: t.blue, label: "Client" },
              { color: t.accent, label: "Orchestrator" },
              { color: t.red, label: "RabbitMQ" },
              { color: t.textMuted, label: "Workers (EMA · SMA · RSI)" },
              { color: t.amber, label: "Redis Cache" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 10, color: t.textMuted, ...mono }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern breakdown */}
        <div {...reveal("arch-cards")} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {[
            {
              icon: "⟳",
              title: "RabbitMQ RPC Fan-out",
              color: t.red,
              body: "When a request arrives, the orchestrator publishes three jobs — one per indicator — to separate RabbitMQ queues simultaneously. Each worker picks up its job, processes it independently, and publishes the result to a reply queue.",
              tag: "Core Pattern",
            },
            {
              icon: "#",
              title: "UUID Correlation IDs",
              color: t.blue,
              body: "Each fan-out batch is tagged with a unique UUID. When workers return results to the shared reply queue, the orchestrator matches them to the original request using these IDs — enabling stateless parallel dispatch without race conditions.",
              tag: "RPC Pattern",
            },
            {
              icon: "◈",
              title: "Redis Cache-aside",
              color: t.amber,
              body: "Before fetching from Yahoo Finance, the orchestrator checks Redis for a cached candle dataset. Cache keys are ticker+date range with a 24-hour TTL — aligned to market session boundaries. Cache hits skip the external API entirely.",
              tag: "Caching",
            },
            {
              icon: "⊕",
              title: "Result Aggregation",
              color: t.accent,
              body: "The orchestrator awaits all three worker responses (with a timeout), merges them into a single result object alongside the candle data, and returns one clean response to the client — hiding the distributed complexity completely.",
              tag: "Orchestration",
            },
          ].map(c => (
            <div key={c.title} className="card-h" style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 12, padding: "22px 24px",
              boxShadow: t.shadow, borderLeft: `3px solid ${c.color}`,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 7,
                    background: c.color + "15", border: `1px solid ${c.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, color: c.color,
                  }}>{c.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{c.title}</h3>
                </div>
                <Tag color={c.color}>{c.tag}</Tag>
              </div>
              <p style={{ fontSize: 13, color: t.textSub, lineHeight: 1.7 }}>{c.body}</p>
            </div>
          ))}
        </div>

        {/* Code snippet — pseudocode of the pattern */}
        <div {...reveal("arch-code")} style={{
          background: t.codeBase, border: `1px solid ${t.codeBorder}`,
          borderRadius: 12, padding: "24px 28px", boxShadow: t.shadow,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <p style={{ fontSize: 10, color: t.textMuted, ...mono, letterSpacing: "0.8px" }}>ORCHESTRATOR · PSEUDOCODE</p>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ef4444", "#f59e0b", "#10b981"].map(c => (
                <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.6 }} />
              ))}
            </div>
          </div>
          <div>
            <CodeLine color={t.textMuted}>{"// 1. Check Redis cache first"}</CodeLine>
            <CodeLine color={t.blue}>{"const cached = await redis.get(`candles:${ticker}:${range}`);"}</CodeLine>
            <CodeLine color={t.textSub}>{"const candles = cached ?? await fetchYahooFinance(ticker, range);"}</CodeLine>
            <CodeLine>&nbsp;</CodeLine>
            <CodeLine color={t.textMuted}>{"// 2. Fan out to 3 workers via RabbitMQ"}</CodeLine>
            <CodeLine color={t.text}>{"const correlationId = uuid();"}</CodeLine>
            <CodeLine color={t.blue}>{"const jobs = ['ema', 'sma', 'rsi'];"}</CodeLine>
            <CodeLine color={t.textSub}>{"jobs.forEach(type => channel.publish("}</CodeLine>
            <CodeLine indent={1} color={t.textSub}>{`\`queue.${"{type}"}\`, { candles, correlationId }`}</CodeLine>
            <CodeLine color={t.textSub}>{"));"}</CodeLine>
            <CodeLine>&nbsp;</CodeLine>
            <CodeLine color={t.textMuted}>{"// 3. Collect responses by correlationId"}</CodeLine>
            <CodeLine color={t.text}>{"const results = await collectReplies(correlationId, 3);"}</CodeLine>
            <CodeLine>&nbsp;</CodeLine>
            <CodeLine color={t.textMuted}>{"// 4. Aggregate and return"}</CodeLine>
            <CodeLine color={t.accent}>{"return { candles, results }; // ← single clean response"}</CodeLine>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Stack ── */}
      <section style={{ maxWidth: 1080, margin: "0 auto" }} className="section">
        <div {...reveal("stack")}>
          <p style={{ fontSize: 10, color: t.textMuted, ...mono, letterSpacing: "1px", marginBottom: 12 }}>TECH STACK</p>
          <h2 style={{ ...serif, fontSize: 36, fontWeight: 400, letterSpacing: "-0.5px", color: t.text, marginBottom: 32 }}>
            What it runs on
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { name: "Node.js / Express", role: "Each microservice runtime", color: t.accent },
              { name: "RabbitMQ", role: "Message broker & RPC queue", color: t.red },
              { name: "Redis", role: "Candle data cache (24h TTL)", color: t.amber },
              { name: "Yahoo Finance API", role: "Historical OHLCV source", color: t.blue },
              { name: "React + Recharts", role: "Frontend & charting", color: t.accent },
              { name: "Docker", role: "Local containerisation", color: t.blue },
              { name: "Render.com", role: "Free-tier cloud hosting", color: t.amber },
              { name: "DM Mono + Instrument Serif", role: "Typography system", color: t.textMuted },
            ].map(s => (
              <div key={s.name} className="card-h" style={{
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 10, padding: "16px 18px",
                boxShadow: t.shadow,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: s.color, marginBottom: 10 }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: t.text, ...mono, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>{s.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── About / Student project ── */}
      <section id="about" style={{ maxWidth: 1080, margin: "0 auto" }} className="section">
        <div {...reveal("about")} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: 10, color: t.textMuted, ...mono, letterSpacing: "1px", marginBottom: 12 }}>ABOUT THIS PROJECT</p>
            <h2 style={{ ...serif, fontSize: 38, fontWeight: 400, letterSpacing: "-0.5px", color: t.text, lineHeight: 1.1, marginBottom: 18 }}>
              A student-built<br />systems project
            </h2>
            <p style={{ fontSize: 14, color: t.textSub, lineHeight: 1.75, marginBottom: 16 }}>
              Quantiva v3 was built to demonstrate practical distributed systems engineering — not AI gimmicks, not toy tutorials. The goal was to ship a real system using patterns that appear in production infrastructure.
            </p>
            <p style={{ fontSize: 14, color: t.textSub, lineHeight: 1.75, marginBottom: 24 }}>
              The project covers the RabbitMQ RPC fan-out pattern, cache-aside with Redis, UUID-based correlation for stateless parallel dispatch, and microservice decomposition — all problems that matter at scale.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Tag>Distributed Systems</Tag>
              <Tag color={t.blue}>Message Queues</Tag>
              <Tag color={t.amber}>Backend Engineering</Tag>
              <Tag color={t.red}>Microservices</Tag>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                q: "Why RabbitMQ and not Kafka?",
                a: "Kafka is built for high-throughput log streaming where message ordering and replay matter. RabbitMQ is better suited for task queues and RPC patterns — exactly what this project needs. The RPC pattern with correlation IDs maps directly to RabbitMQ's direct-reply-to mechanism.",
              },
              {
                q: "Why a 24-hour Redis TTL?",
                a: "Candle data for a trading day is immutable once the market closes. A TTL aligned to market sessions means the cache is always warm during the day but refreshes overnight — no stale data, no redundant Yahoo Finance calls.",
              },
              {
                q: "What did you learn building this?",
                a: "The hardest problem wasn't the distributed part — it was correlation. Ensuring the orchestrator could match 3 async replies to the correct originating request, without blocking, taught more about async patterns than any tutorial.",
              },
            ].map((faq, i) => (
              <div key={i} style={{
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: 12, padding: "18px 20px",
                boxShadow: t.shadow,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 12, color: t.textSub, lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── CTA ── */}
      <section style={{ maxWidth: 1080, margin: "0 auto" }} className="section">
        <div {...reveal("cta")} style={{
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 16, padding: "56px 48px",
          textAlign: "center", boxShadow: t.shadowLg,
        }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: t.accentBg, border: `1px solid ${t.accentBorder}`,
              borderRadius: 20, padding: "4px 14px 4px 10px", marginBottom: 24,
            }}>
              <div className="blink" style={{ width: 6, height: 6, borderRadius: "50%", background: t.accent }} />
              <span style={{ fontSize: 11, color: t.accentText, ...mono }}>Ready to use</span>
            </div>
          </div>
          <h2 style={{ ...serif, fontSize: 44, fontWeight: 400, letterSpacing: "-1px", color: t.text, marginBottom: 14 }}>
            Run your first analysis
          </h2>
          <p style={{ fontSize: 14, color: t.textSub, maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Pick a ticker, set a date range, and see the distributed system work. Remember — the first run may take up to 60 seconds while services wake up.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="cta-btn" href="/analysis">Launch Quantiva →</a>
            <a className="cta-ghost" href="#notice">Why is it slow?</a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: `1px solid ${t.border}`,
        padding: "28px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: t.surface,
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 5, background: t.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            ...serif, fontStyle: "italic", fontSize: 12, color: "#fff",
          }}>Q</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Quantiva</span>
          <span style={{ fontSize: 11, color: t.textMuted }}>· Student project · Free tier hosting</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Architecture", "About", "Hosting notice"].map(l => (
            <a key={l} className="nav-link" style={{ fontSize: 12 }} href="#">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}