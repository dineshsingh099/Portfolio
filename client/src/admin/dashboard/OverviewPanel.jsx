import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useDashboard from "./useDashboard";
import { usePortfolio } from "../../context/PortfolioContext";

const RANGES = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "1y", label: "1Y" },
];

const DEVICE_COLORS = { Desktop: "#00f7ff", Mobile: "#8b5cf6", Tablet: "#facc15", Unknown: "#475569" };

function codeToFlag(code) {
  if (!code || code.length !== 2) return "🌍";
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const ACTIVITY_ICONS = {
  hero: "fa-solid fa-house",
  about: "fa-solid fa-user",
  skills: "fa-solid fa-code",
  experience: "fa-solid fa-briefcase",
  education: "fa-solid fa-graduation-cap",
  projects: "fa-solid fa-diagram-project",
  certifications: "fa-solid fa-certificate",
  testimonials: "fa-solid fa-quote-left",
  resume: "fa-regular fa-file-pdf",
  contact: "fa-solid fa-envelope",
  seo: "fa-solid fa-magnifying-glass-chart",
  message: "fa-solid fa-envelope-open-text",
  message_deleted: "fa-solid fa-trash",
};

function StatCard({ icon, color, label, value, change, sublabel }) {
  const isUp = (change ?? 0) >= 0;
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: `${color}22`, color }}>
        <i className={icon}></i>
      </div>
      <div className="stat-card-body">
        <p className="stat-card-label">{label}</p>
        <h3>{value}</h3>
        {change !== undefined && change !== null ? (
          <span className={`stat-card-change ${isUp ? "up" : "down"}`}>
            <i className={`fa-solid fa-arrow-${isUp ? "up" : "down"}`}></i> {Math.abs(change)}%{" "}
            <em>{sublabel || "vs last period"}</em>
          </span>
        ) : (
          <span className="stat-card-change neutral">{sublabel || "All time"}</span>
        )}
      </div>
    </div>
  );
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
  if (diff < 172800) return "Yesterday";
  return `${Math.floor(diff / 86400)} days ago`;
}

function Heatmap({ heatmap }) {
  const weeks = useMemo(() => {
    const map = new Map((heatmap || []).map((h) => [h.date, h.count]));
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 97; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, count: map.get(key) || 0, label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) });
    }
    const cols = [];
    for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));
    return cols;
  }, [heatmap]);

  const max = Math.max(1, ...weeks.flat().map((d) => d.count));
  const level = (count) => {
    if (count === 0) return 0;
    const ratio = count / max;
    if (ratio > 0.75) return 4;
    if (ratio > 0.5) return 3;
    if (ratio > 0.25) return 2;
    return 1;
  };

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div className="heatmap-col" key={wi}>
            {week.map((d) => (
              <div key={d.date} className={`heatmap-cell level-${level(d.count)}`} title={`${d.label}: ${d.count} visits`} />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={`heatmap-cell level-${l}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default function OverviewPanel({ onQuickAction }) {
  const [range, setRange] = useState("30d");
  const { data, loading } = useDashboard(range);
  const { content } = usePortfolio();

  if (loading && !data) {
    return <div className="dash-loading">Loading dashboard...</div>;
  }
  if (!data) {
    return <div className="dash-loading">Unable to load analytics. Is the backend running?</div>;
  }

  const { stats, overview, devices, top_countries, traffic_sources, top_pages, heatmap, recent_activity, latest_messages } = data;
  const deviceTotal = devices.reduce((n, d) => n + d.value, 0);

  return (
    <div className="ov-wrap">
      <div className="stat-grid-7">
        <StatCard icon="fa-solid fa-eye" color="#00f7ff" label="Portfolio Views" value={stats.portfolio_views.value.toLocaleString()} change={stats.portfolio_views.change} sublabel="vs last 7 days" />
        <StatCard icon="fa-solid fa-users" color="#8b5cf6" label="Unique Visitors" value={stats.unique_visitors.value.toLocaleString()} change={stats.unique_visitors.change} sublabel="vs last 7 days" />
        <StatCard icon="fa-solid fa-calendar-day" color="#00d084" label="Visitors Today" value={stats.visitors_today.value.toLocaleString()} change={stats.visitors_today.change} sublabel="vs yesterday" />
        <StatCard icon="fa-solid fa-envelope" color="#ff4d6d" label="Messages" value={stats.messages.value.toLocaleString()} change={stats.messages.change} sublabel={`${stats.messages.unread} unread`} />
        <StatCard icon="fa-solid fa-file-arrow-down" color="#facc15" label="Resume Downloads" value={stats.resume_downloads.value.toLocaleString()} change={stats.resume_downloads.change} sublabel="vs last 7 days" />
        <StatCard icon="fa-solid fa-diagram-project" color="#00f7ff" label="Projects" value={stats.projects.value} sublabel="All time" />
        <StatCard icon="fa-solid fa-certificate" color="#8b5cf6" label="Certificates" value={stats.certificates.value} sublabel="All time" />
      </div>

      <div className="ov-row-3">
        <div className="dash-panel ov-chart-panel">
          <div className="dash-panel-header">
            <h3>Visitor Overview</h3>
            <div className="range-tabs">
              {RANGES.map((r) => (
                <button key={r.key} className={range === r.key ? "active" : ""} onClick={() => setRange(r.key)}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={overview}>
                <defs>
                  <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f7ff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#00f7ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#8892b0" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8892b0" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0d1424", border: "1px solid #1e293b", borderRadius: 10 }} labelStyle={{ color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="views" stroke="#00f7ff" strokeWidth={2.5} fill="url(#viewsFill)" name="Visitors" dot={{ r: 3, fill: "#00f7ff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-panel ov-device-panel">
          <h3>Visitors by Device</h3>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={devices} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {devices.map((d, i) => (
                    <Cell key={i} fill={DEVICE_COLORS[d.name] || "#475569"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0d1424", border: "1px solid #1e293b", borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <b>{deviceTotal.toLocaleString()}</b>
              <span>Total</span>
            </div>
          </div>
          <ul className="device-legend">
            {devices.length === 0 && <li className="muted">No data yet</li>}
            {devices.map((d) => (
              <li key={d.name}>
                <span className="dot" style={{ background: DEVICE_COLORS[d.name] || "#475569" }}></span>
                {d.name} <b>{d.pct}%</b>
              </li>
            ))}
          </ul>
        </div>

        <div className="dash-panel ov-quick-panel">
          <h3><i className="fa-solid fa-bolt"></i> Quick Actions</h3>
          <div className="quick-grid">
            <button onClick={() => onQuickAction("projects")}><i className="fa-solid fa-plus"></i> Add Project</button>
            <button onClick={() => onQuickAction("skills")}><i className="fa-solid fa-code"></i> Add Skill</button>
            <button onClick={() => onQuickAction("resume")}><i className="fa-solid fa-file-arrow-up"></i> Upload Resume</button>
            <button onClick={() => onQuickAction("hero")}><i className="fa-solid fa-pen"></i> Change Hero</button>
            <button onClick={() => onQuickAction("certifications")}><i className="fa-solid fa-certificate"></i> Add Certificate</button>
            <button onClick={() => onQuickAction("experience")}><i className="fa-solid fa-briefcase"></i> Add Experience</button>
            <button onClick={() => onQuickAction("education")}><i className="fa-solid fa-graduation-cap"></i> Add Education</button>
            <button onClick={() => onQuickAction("about")}><i className="fa-solid fa-user"></i> Edit About</button>
          </div>
        </div>
      </div>

      <div className="ov-row-4">
        <div className="dash-panel">
          <h3>Top Countries</h3>
          <ul className="bar-list">
            {top_countries.length === 0 && <li className="muted">No visitor data yet</li>}
            {top_countries.map((c) => (
              <li key={c.country}>
                <div className="bar-list-label">
                  <span>{c.country === "Unknown" ? "🌐" : codeToFlag(c.code)} {c.country}</span>
                  <b>{c.pct}%</b>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${c.pct}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="dash-panel">
          <h3>Top Traffic Sources</h3>
          <ul className="bar-list">
            {traffic_sources.length === 0 && <li className="muted">No visitor data yet</li>}
            {traffic_sources.map((s) => (
              <li key={s.source}>
                <div className="bar-list-label">
                  <span>{s.source}</span>
                  <b>{s.pct}%</b>
                </div>
                <div className="bar-track"><div className="bar-fill purple" style={{ width: `${s.pct}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="dash-panel">
          <h3>Top Pages</h3>
          <ul className="bar-list">
            {top_pages.length === 0 && <li className="muted">No page views yet</li>}
            {top_pages.map((p) => (
              <li key={p.path}>
                <div className="bar-list-label">
                  <span>{p.path}</span>
                  <b>{p.pct}%</b>
                </div>
                <div className="bar-track"><div className="bar-fill green" style={{ width: `${p.pct}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>Recent Activity</h3>
          </div>
          <ul className="activity-list">
            {recent_activity.length === 0 && <li className="muted">No activity recorded yet</li>}
            {recent_activity.map((a, i) => (
              <li key={i}>
                <span className="activity-icon"><i className={ACTIVITY_ICONS[a.action] || "fa-solid fa-circle-info"}></i></span>
                <div>
                  <p>{a.message}</p>
                  <span>{timeAgo(a.created_at)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ov-row-3b">
        <div className="dash-panel">
          <h3>Portfolio Visitors Heatmap</h3>
          <Heatmap heatmap={heatmap} />
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>Latest Messages</h3>
            <button className="link-btn" onClick={() => onQuickAction("messages")}>View All</button>
          </div>
          <ul className="msg-preview-list">
            {latest_messages.length === 0 && <li className="muted">No messages yet</li>}
            {latest_messages.map((m) => (
              <li key={m.id} onClick={() => onQuickAction("messages")}>
                <div className="msg-avatar">{m.name?.[0]?.toUpperCase() || "?"}</div>
                <div className="msg-preview-body">
                  <h4>{m.name} {!m.read && <span className="msg-dot" />}</h4>
                  <p>{m.subject || m.email}</p>
                </div>
                <span className="msg-time">{timeAgo(m.created_at)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="dash-panel portfolio-preview-panel">
          <h3>Portfolio Preview</h3>
          <div className="mini-browser">
            <div className="mini-browser-bar">
              <span></span><span></span><span></span>
            </div>
            <div className="mini-browser-body">
              <div className="mini-hero-name">{content?.hero?.firstName} {content?.hero?.lastName}</div>
              <div className="mini-hero-role">{content?.hero?.roles?.[0] || "Developer"}</div>
              <div className="mini-hero-actions">
                <span>View Work</span>
                <span className="outline">Contact Me</span>
              </div>
            </div>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="btn-save" style={{ display: "block", textAlign: "center", textDecoration: "none", marginTop: 14 }}>
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Open Live Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
