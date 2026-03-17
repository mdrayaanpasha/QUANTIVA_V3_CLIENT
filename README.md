# Quantiva v3.0 — Client

Frontend for the Quantiva v3.0 pipeline. Three-route SPA built with React + TailwindCSS, deployed on Vercel.

**Live:** https://quantiva-eight.vercel.app/

---

## Routes

| Path        | Component       | Purpose                                         |
|-------------|-----------------|-------------------------------------------------|
| `/`         | `Home`          | Landing page — pipeline overview                |
| `/analysis` | `Analysis`      | Ticker analysis — EMA/SMA/RSI + benchmark results |
| `/links`    | `QuantivaLinks` | Service endpoint references                     |

---

## Stack

| Layer   | Technology         |
|---------|--------------------|
| Runtime | React 18 (JSX)     |
| Styling | TailwindCSS        |
| Routing | React Router v6    |
| Deploy  | Vercel             |

---

## Data Source

All data fetched from the orchestrator server (`/initiate-company-analysis`, `/benchmark`). The analysis page accepts a ticker + date range, dispatches to the orchestrator, and renders EMA/SMA/RSI results alongside per-path timing metrics.

---

## Running

```bash
npm install
npm run dev

# Production build
npm run build
```

Vercel deploys automatically on push to `main`.

---

## Structure

```
src/
├── App.jsx
└── pages/
    ├── home/main.jsx      # Home
    ├── analysis/main.jsx  # Analysis
    └── links/main.jsx     # QuantivaLinks
```
