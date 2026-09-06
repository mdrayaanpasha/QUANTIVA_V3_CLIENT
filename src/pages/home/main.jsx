import { useState, useEffect, useRef } from "react";
import Beams from "./Beams";

const themes = {
  light: {
    bg: "#FAFAFA",
    glass: "rgba(255, 255, 255, 0.7)",
    surface: "#FFFFFF",
    border: "rgba(0, 0, 0, 0.08)",
    text: "#171717",
    textSub: "#737373",
    accent: "#000000",
    accentGlow: "rgba(0, 0, 0, 0.05)",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
  },
  dark: {
    bg: "#0A0A0A",
    glass: "rgba(25, 25, 25, 0.4)",
    surface: "#121212",
    border: "rgba(255, 255, 255, 0.08)",
    text: "#EDEDED",
    textSub: "#A1A1AA",
    accent: "#FFFFFF",
    accentGlow: "rgba(255, 255, 255, 0.05)",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  },
};

const ArchDiagram = ({ t }) => {
  const node = (label, sub, x, y, isMain) => (
    <g key={label} transform={`translate(${x},${y})`}>
      <rect
        x={isMain ? -56 : -48} y={-24}
        width={isMain ? 112 : 96} height={48}
        rx={12}
        fill={t.glass}
        stroke={t.border}
        strokeWidth={1}
        style={{ backdropFilter: "blur(12px)" }}
      />
      <text textAnchor="middle" y={-2} fontSize={12} fontFamily="'Inter', sans-serif" fontWeight={500} fill={t.text}>
        {label}
      </text>
      <text textAnchor="middle" y={14} fontSize={10} fontFamily="'JetBrains Mono', monospace" fill={t.textSub}>
        {sub}
      </text>
    </g>
  );

  const arrow = (x1, y1, x2, y2, dashed) => (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={t.border}
      strokeWidth={1.5}
      strokeDasharray={dashed ? "4 4" : "0"}
      markerEnd="url(#arr)"
    />
  );

  return (
    <svg viewBox="0 0 700 220" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto", overflow: "visible" }}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={t.textSub} />
        </marker>
      </defs>

      {/* Nodes */}
      {node("Client", "Browser", 70, 110, true)}
      {node("Orchestrator", "API Gateway", 230, 110, true)}
      {node("Redis", "Cache", 230, 190, false)}
      {node("RabbitMQ", "Message Bus", 420, 110, true)}
      
      {/* Workers */}
      {node("EMA", "Worker", 590, 45, false)}
      {node("SMA", "Worker", 590, 110, false)}
      {node("RSI", "Worker", 590, 175, false)}

      {/* Arrows */}
      {arrow(126, 110, 174, 110, false)}
      {arrow(286, 110, 364, 110, false)}
      {arrow(230, 134, 230, 166, false)}
      {arrow(476, 110, 542, 110, false)}
      {arrow(460, 86, 542, 55, false)}
      {arrow(460, 134, 542, 165, false)}

      {/* Labels */}
      <text x={150} y={100} fontSize={9} fontFamily="'JetBrains Mono', monospace" fill={t.textSub} textAnchor="middle">REST</text>
      <text x={325} y={100} fontSize={9} fontFamily="'JetBrains Mono', monospace" fill={t.textSub} textAnchor="middle">fan-out</text>
    </svg>
  );
};

export default function QuantivaLanding() {
  const [isDark, setIsDark] = useState(true); // Defaulting to dark for that premium feel
  const t = themes[isDark ? "dark" : "light"];
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.id]: true }));
      }),
      { threshold: 0.1 }
    );
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const reveal = (id) => ({
    ref: el => refs.current[id] = el,
    "data-id": id,
    style: {
      opacity: visible[id] ? 1 : 0,
      transform: visible[id] ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
    }
  });

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: t.text, fontFamily: "'Inter', sans-serif", overflowX: "hidden", transition: "background 0.3s ease" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1 }}>
        <Beams 
          backgroundColor={t.bg} 
          beamColor={isDark ? "#00000" : "#000000"} 
          lightColor={isDark ? "#00000" : "#000000"}
          lightMode={!isDark}
        />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${t.text}; color: ${t.bg}; }
        ::-webkit-scrollbar { width: 0px; }
        
        .glass-panel {
          background: ${t.glass};
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid ${t.border};
          box-shadow: ${t.shadow};
        }
        
        .nav-link {
          font-size: 13px; font-weight: 500; color: ${t.textSub}; text-decoration: none;
          transition: color 0.2s ease; cursor: pointer;
        }
        .nav-link:hover { color: ${t.text}; }
        
        .btn-primary {
          background: ${t.text}; color: ${t.bg}; border: none; border-radius: 99px;
          padding: 12px 24px; font-family: 'Inter', sans-serif; font-size: 14px;
          font-weight: 500; cursor: pointer; text-decoration: none; display: inline-flex;
          align-items: center; gap: 8px; transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .btn-primary:hover { transform: scale(0.98); opacity: 0.9; }
        
        .btn-secondary {
          background: transparent; color: ${t.text}; border: 1px solid ${t.border};
          border-radius: 99px; padding: 12px 24px; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; transition: background 0.2s ease;
        }
        .btn-secondary:hover { background: ${t.accentGlow}; }
        
        .badge {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          padding: 4px 10px; border-radius: 99px; background: ${t.accentGlow};
          border: 1px solid ${t.border}; color: ${t.textSub};
        }
      `}</style>

      {/* Navigation */}
      <nav className="glass-panel" style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 32px)", maxWidth: 1000, height: 56, borderRadius: 99,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.text }} />
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.3px" }}>Quantiva</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", gap: 24, display: window.innerWidth > 600 ? 'flex' : 'none' }}>
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#architecture">Architecture</a>
            <a className="nav-link" href="#stack">Stack</a>
          </div>
          <a className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }} href="/analysis">
            Launch App
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 180, paddingBottom: 100, paddingX: 24, textAlign: "center" }}>
        <div {...reveal("hero")} style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-block", marginBottom: 24 }} className="badge">
            v3.0 
          </div>
          <h1 style={{
            fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 500,
            letterSpacing: "-0.04em", lineHeight: 1.05,
            color: t.text, marginBottom: 24,
          }}>
            Market analysis. <br />
            <span style={{ color: t.textSub }}>Engineered for scale.</span>
          </h1>
          <p style={{ fontSize: 18, color: t.textSub, lineHeight: 1.6, maxWidth: 540, margin: "0 auto 40px" }}>
            A distributed computing engine for financial indicators.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn-primary" href="/analysis">Start Analyzing</a>
            <a className="btn-secondary" href="#architecture">View Architecture</a>
          </div>
        </div>
      </section>

      {/* Features / What it does */}
      <section id="features" style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
        <div {...reveal("what")} className="glass-panel" style={{ borderRadius: 24, padding: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.03em", marginBottom: 16 }}>Real-time indicators,<br/>computed in parallel.</h2>
              <p style={{ color: t.textSub, lineHeight: 1.6, marginBottom: 32 }}>
                Select a ticker and timeframe. The orchestrator fetches OHLCV data and dispatches jobs to specialized workers simultaneously, merging the results seamlessly.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {[
                  { title: "Exponential Moving Average (EMA)", desc: "Weighted heavily towards recent price action for trend sensitivity." },
                  { title: "Simple Moving Average (SMA)", desc: "Provides a stable baseline across the selected timeframe." },
                  { title: "Relative Strength Index (RSI)", desc: "Momentum oscillator tracking overbought and oversold conditions." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16 }}>
                    <div style={{ color: t.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginTop: 4 }}>0{i+1}</div>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: t.textSub }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Data Card */}
            <div className="glass-panel" style={{ borderRadius: 16, padding: 32, background: isDark ? 'rgba(0,0,0,0.4)' : '#fff' }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: t.text, color: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>AAPL</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Apple Inc.</div>
                    <div style={{ fontSize: 12, color: t.textSub, fontFamily: "'JetBrains Mono', monospace" }}>NASDAQ</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 500 }}>$237.87</div>
                  <div style={{ fontSize: 12, color: "#10b981", fontFamily: "'JetBrains Mono', monospace" }}>+2.41%</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "EMA (20)", val: "236.38", status: "Bullish" },
                  { label: "SMA (20)", val: "237.65", status: "Neutral" },
                  { label: "RSI (14)", val: "43.49", status: "Oversold" },
                ].map(ind => (
                  <div key={ind.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 16, borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ color: t.textSub, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{ind.label}</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 500 }}>{ind.val}</div>
                      <div style={{ fontSize: 11, color: t.textSub }}>{ind.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
        <div {...reveal("arch-head")} style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.03em", marginBottom: 16 }}>Built for scale.</h2>
          <p style={{ color: t.textSub, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
            A decoupled microservices architecture utilizing RPC patterns to process heavy financial computations without blocking the main thread.
          </p>
        </div>

        <div {...reveal("arch-diagram")} style={{ marginBottom: 48, padding: "40px 0" }}>
          <ArchDiagram t={t} />
        </div>

        <div {...reveal("arch-grid")} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {[
            { title: "RPC Fan-out", desc: "The orchestrator publishes jobs to specialized RabbitMQ queues. Workers compute independently and reply instantly." },
            { title: "UUID Correlation", desc: "Stateless parallel dispatch. Results are matched to the original client request using unique identifiers." },
            { title: "Cache-Aside", desc: "Redis stores Yahoo Finance OHLCV data with 24-hour TTLs, aligning perfectly with market session boundaries." }
          ].map(item => (
            <div key={item.title} className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: t.textSub, lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section id="stack" style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px 120px" }}>
        <div {...reveal("stack")} className="glass-panel" style={{ padding: 48, borderRadius: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 32 }}>The Stack</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { name: "React", role: "Frontend UI" },
              { name: "Node.js", role: "Microservices Runtime" },
              { name: "RabbitMQ", role: "Message Broker" },
              { name: "Redis", role: "In-memory Cache" },
              { name: "Docker", role: "Containerization" },
              { name: "Yahoo Finance", role: "Data Provider" }
            ].map(tech => (
              <div key={tech.name} style={{ padding: 16, border: `1px solid ${t.border}`, borderRadius: 12 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginBottom: 4 }}>{tech.name}</div>
                <div style={{ fontSize: 12, color: t.textSub }}>{tech.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: "40px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 24 }}>
           <div style={{ width: 12, height: 12, borderRadius: "50%", background: t.text }} />
           <span style={{ fontWeight: 500 }}>Quantiva</span>
        </div>
        <div style={{ fontSize: 13, color: t.textSub }}>
          Engineered for distributed analysis.
        </div>
      </footer>
    </div>
  );
}