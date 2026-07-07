import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useAnalytics from "../hooks/useAnalytics";

export default function OverviewPanel() {
  const { data, loading } = useAnalytics();

  if (loading) {
    return <div className="dash-loading">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="dash-loading">Unable to load analytics data.</div>;
  }

  return (
    <div>
      <div className="dash-stat-grid">
        <div className="dash-stat-card">
          <i className="fa-solid fa-eye"></i>
          <h3>{data.total_views}</h3>
          <p>Total Page Views</p>
        </div>
        <div className="dash-stat-card">
          <i className="fa-solid fa-users"></i>
          <h3>{data.unique_visitors}</h3>
          <p>Unique Visitors</p>
        </div>
        <div className="dash-stat-card">
          <i className="fa-solid fa-calendar-day"></i>
          <h3>{data.today_views}</h3>
          <p>Views Today</p>
        </div>
      </div>

      <div className="dash-panel">
        <h3>Visitors — Last 30 Days</h3>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#8892b0" fontSize={11} />
              <YAxis stroke="#8892b0" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0d1424", border: "1px solid #1e293b", borderRadius: 8 }} />
              <Line type="monotone" dataKey="views" stroke="#00f7ff" strokeWidth={2} dot={false} name="Page Views" />
              <Line type="monotone" dataKey="unique" stroke="#a855f7" strokeWidth={2} dot={false} name="Unique Visitors" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dash-panel">
        <h3>Top Pages</h3>
        <ul className="dash-top-pages">
          {data.top_pages.map((p) => (
            <li key={p.path}>
              <span>{p.path}</span>
              <b>{p.views} views</b>
            </li>
          ))}
          {data.top_pages.length === 0 && <li>No page views recorded yet.</li>}
        </ul>
      </div>
    </div>
  );
}
