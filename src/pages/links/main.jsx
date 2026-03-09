import { useState } from "react";

const GITHUB_BASE = "https://github.com/mdrayaanpasha";

const REPOS = [
  {
    name: "QUANTIVA_3.0_SERVICE_1",
    role: "Orchestrator",
    desc: "RabbitMQ fan-out, Redis cache-aside, Yahoo Finance fetch, UUID correlation",
    lang: "JavaScript",
    updated: "14 min ago",
    href: `${GITHUB_BASE}/QUANTIVA_3.0_SERVICE_1`,
    live: "https://quantiva-3-0-service-1.onrender.com/",
    badge: "core",
  },
  {
    name: "QUANTIVA_V3_CLIENT",
    role: "Frontend",
    desc: "React dashboard — ticker selection, analysis params, OHLCV chart, indicator cards",
    lang: "JavaScript",
    updated: "23 min ago",
    href: `${GITHUB_BASE}/QUANTIVA_V3_CLIENT`,
    live: "https://quantiva-eight.vercel.app/",
    badge: "ui",
  },
  {
    name: "QUANTIVA_3.0_SERVICE_2",
    role: "EMA Worker",
    desc: "Consumes ema_queue, computes Exponential Moving Average, publishes result",
    lang: "JavaScript",
    updated: "2 days ago",
    href: `${GITHUB_BASE}/QUANTIVA_3.0_SERVICE_2`,
    live: "https://quantiva-3-0-service-2.onrender.com/",
    badge: "worker",
  },
  {
    name: "QUANTIVA_3.0_SERVICE_3",
    role: "RSI Worker",
    desc: "Consumes rsi_queue, computes Relative Strength Index, publishes result",
    lang: "JavaScript",
    updated: "2 days ago",
    href: `${GITHUB_BASE}/QUANTIVA_3.0_SERVICE_3`,
    live: "https://quantiva-3-0-service-3.onrender.com/",
    badge: "worker",
  },
  {
    name: "QUANTIVA_3.0_SERVICE_4",
    role: "SMA Worker",
    desc: "Consumes sma_queue, computes Simple Moving Average, publishes result",
    lang: "JavaScript",
    updated: "2 days ago",
    href: `${GITHUB_BASE}/QUANTIVA_3.0_SERVICE_4`,
    live: "https://quantiva-3-0-service-4.onrender.com/",
    badge: "worker",
  },
];

const BADGE_STYLES = {
  core: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  ui: "bg-blue-50 text-blue-700 border border-blue-200",
  worker: "bg-amber-50 text-amber-700 border border-amber-200",
};

const BADGE_LABELS = {
  core: "Orchestrator",
  ui: "Frontend",
  worker: "Worker",
};

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function RepoCard({ repo, index }) {
  const [copied, setCopied] = useState(false);

  const copy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(repo.live);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-md transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
            <GithubIcon />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-mono text-gray-400 truncate leading-none mb-1">{repo.name}</p>
            <p className="text-sm font-semibold text-gray-900 leading-none">{repo.role}</p>
          </div>
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${BADGE_STYLES[repo.badge]}`}>
          {BADGE_LABELS[repo.badge]}
        </span>
      </div>

      {/* Desc */}
      <p className="text-xs text-gray-500 leading-relaxed mb-4">{repo.desc}</p>

      {/* Bottom actions */}
      <div className="flex items-center gap-2">
        <a
          href={repo.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-all duration-150"
        >
          <GithubIcon />
          Source
        </a>
        <a
          href={repo.live}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-1.5 transition-all duration-150"
        >
          <ExternalIcon />
          Live
        </a>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-gray-600 border border-gray-100 hover:border-gray-200 rounded-lg px-3 py-1.5 transition-all duration-150 ml-auto"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy URL"}
        </button>
      </div>

      {/* Updated */}
      <p className="text-xs text-gray-300 font-mono mt-3">Updated {repo.updated}</p>
    </div>
  );
}

export default function QuantivaLinks() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
        .serif { font-family: 'Instrument Serif', serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .blink { animation: blink 2s ease-in-out infinite; }
      `}</style>

      <div className="max-w-lg mx-auto">

        {/* Profile */}
        <div className="text-center mb-10 fade-up">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="serif italic text-white text-3xl">Q</span>
          </div>
          <h1 className="serif text-2xl text-gray-900 mb-1">Mohammed Rayaan Pasha</h1>
          <p className="mono text-sm text-gray-400 mb-3">mdrayaanpasha</p>

          <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-1.5 shadow-sm">
            <span className="blink w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="mono text-xs text-gray-500">Quantiva v3.0 · Distributed Analysis Engine</span>
          </div>
        </div>



        {/* Cold start notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 fade-up" style={{ animationDelay: "120ms" }}>
          <div className="flex gap-3">
            <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">⚠</span>
            <div>
              <p className="mono text-xs font-medium text-amber-800 mb-1">Expect 30–60s on first load</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                All services run on Render's free tier and shut down after 15 min of inactivity. First request triggers a cold start across all 4 microservices.
              </p>
            </div>
          </div>
        </div>

        {/* Repo cards */}
        <p className="mono text-xs text-gray-400 uppercase tracking-wide mb-3 fade-up px-1" style={{ animationDelay: "140ms" }}>
          Repositories & Services
        </p>
        <div className="flex flex-col gap-3">
          {REPOS.map((repo, i) => (
            <div key={repo.name} className="fade-up" style={{ animationDelay: `${160 + i * 60}ms` }}>
              <RepoCard repo={repo} index={i} />
            </div>
          ))}
        </div>

        {/* GitHub profile link */}
        <div className="mt-6 fade-up" style={{ animationDelay: "560ms" }}>
          <a
            href={GITHUB_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full bg-gray-900 hover:bg-gray-800 text-white rounded-2xl py-3.5 transition-all duration-150 shadow-sm"
          >
            <GithubIcon />
            <span className="mono text-sm">github.com/mdrayaanpasha</span>
          </a>
        </div>

        {/* Footer */}
        <p className="text-center mono text-xs text-gray-300 mt-8 fade-up" style={{ animationDelay: "600ms" }}>
          Built with Node.js · RabbitMQ · Redis · React
        </p>
      </div>
    </div>
  );
}