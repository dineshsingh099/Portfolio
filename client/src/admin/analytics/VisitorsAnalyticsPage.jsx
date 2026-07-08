import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useDashboard from "../dashboard/useDashboard";

const RANGES = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "1y", label: "1 Year" },
];

function codeToFlag(code) {
  if (!code || code.length !== 2) return "🌍";
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export default function VisitorsAnalyticsPage() {
  const [range, setRange] = useState("30d");
  const { data, loading } = useDashboard(range);

  if (loading && !data) return <div className="dash-loading">Loading analytics...</div>;
  if (!data) return <div className="dash-loading">Unable to load analytics.</div>;

  const { stats, overview, devices, top_countries, traffic_sources, top_pages } = data;

  return (
    <div className="ov-wrap">
      <div className="dash-panel">
        <div className="dash-panel-header">
          <h3>Visitor Analytics</h3>
          <div className="range-tabs">
            {RANGES.map((r) => (
              <button key={r.key} className={range === r.key ? "active" : ""} onClick={() => setRange(r.key)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="stat-grid-7" style={{ marginBottom: 24 }}>
          <div className="mini-stat"><span>Total Views</span><b>{stats.portfolio_views.value.toLocaleString()}</b></div>
          <div className="mini-stat"><span>Unique Visitors</span><b>{stats.unique_visitors.value.toLocaleString()}</b></div>
          <div className="mini-stat"><span>Visitors Today</span><b>{stats.visitors_today.value.toLocaleString()}</b></div>
          <div className="mini-stat"><span>Resume Downloads</span><b>{stats.resume_downloads.value.toLocaleString()}</b></div>
        </div>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={overview}>
              <defs>
                <linearGradient id="viewsFill2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f7ff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00f7ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="#8892b0" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#8892b0" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0d1424", border: "1px solid #1e293b", borderRadius: 10 }} />
              <Area type="monotone" dataKey="views" stroke="#00f7ff" strokeWidth={2.5} fill="url(#viewsFill2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ov-row-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="dash-panel">
          <h3>Device Breakdown</h3>
          <ul className="bar-list">
            {devices.length === 0 && <li className="muted">No data yet</li>}
            {devices.map((d) => (
              <li key={d.name}>
                <div className="bar-list-label"><span>{d.name}</span><b>{d.pct}%</b></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${d.pct}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="dash-panel">
          <h3>Countries</h3>
          <ul className="bar-list">
            {top_countries.length === 0 && <li className="muted">No data yet</li>}
            {top_countries.map((c) => (
              <li key={c.country}>
                <div className="bar-list-label"><span>{c.country === "Unknown" ? "🌐" : codeToFlag(c.code)} {c.country}</span><b>{c.pct}%</b></div>
                <div className="bar-track"><div className="bar-fill purple" style={{ width: `${c.pct}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="dash-panel">
          <h3>Traffic Sources</h3>
          <ul className="bar-list">
            {traffic_sources.length === 0 && <li className="muted">No data yet</li>}
            {traffic_sources.map((s) => (
              <li key={s.source}>
                <div className="bar-list-label"><span>{s.source}</span><b>{s.pct}%</b></div>
                <div className="bar-track"><div className="bar-fill green" style={{ width: `${s.pct}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dash-panel">
        <h3>Top Pages</h3>
        <ul className="bar-list">
          {top_pages.length === 0 && <li className="muted">No data yet</li>}
          {top_pages.map((p) => (
            <li key={p.path}>
              <div className="bar-list-label"><span>{p.path}</span><b>{p.views} views ({p.pct}%)</b></div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${p.pct}%` }} /></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
