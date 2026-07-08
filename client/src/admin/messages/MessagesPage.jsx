import { useState } from "react";
import useMessages from "./useMessages";

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function MessagesPage() {
  const { messages, total, unread, loading, status, setStatus, q, setQ, markRead, markUnread, remove } = useMessages();
  const [selected, setSelected] = useState(null);

  const open = (m) => {
    setSelected(m);
    if (!m.read) markRead(m.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    await remove(id);
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="msg-page">
      <div className="msg-list-col">
        <div className="dash-panel-header" style={{ marginBottom: 12 }}>
          <h3>Inbox <span className="tab-count">{total}</span></h3>
        </div>
        <div className="msg-toolbar">
          <input placeholder="Search messages..." value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="msg-tabs">
            <button className={status === "all" ? "active" : ""} onClick={() => setStatus("all")}>All</button>
            <button className={status === "unread" ? "active" : ""} onClick={() => setStatus("unread")}>Unread {unread > 0 && <b>{unread}</b>}</button>
            <button className={status === "read" ? "active" : ""} onClick={() => setStatus("read")}>Read</button>
          </div>
        </div>

        <div className="msg-full-list">
          {loading && <div className="dash-loading">Loading...</div>}
          {!loading && messages.length === 0 && <div className="dash-loading">No messages found.</div>}
          {messages.map((m) => (
            <div key={m.id} className={`msg-row${selected?.id === m.id ? " active" : ""}${!m.read ? " unread" : ""}`} onClick={() => open(m)}>
              <div className="msg-avatar">{m.name?.[0]?.toUpperCase() || "?"}</div>
              <div className="msg-row-body">
                <h4>{m.name} {!m.read && <span className="msg-dot" />}</h4>
                <p>{m.subject || "(no subject)"}</p>
                <span>{m.message.slice(0, 60)}{m.message.length > 60 ? "…" : ""}</span>
              </div>
              <span className="msg-time">{timeAgo(m.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="msg-detail-col">
        {!selected && <div className="dash-loading">Select a message to view details.</div>}
        {selected && (
          <div className="dash-panel">
            <div className="dash-panel-header">
              <h3>{selected.subject || "(no subject)"}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-cancel" onClick={() => markUnread(selected.id)}>Mark Unread</button>
                <button className="btn-cancel" style={{ color: "#ff4d6d" }} onClick={() => handleDelete(selected.id)}>
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </div>
            <div className="msg-detail-meta">
              <div><b>Name:</b> {selected.name}</div>
              <div><b>Email:</b> {selected.email}</div>
              <div><b>Country:</b> {selected.country}</div>
              <div><b>Device:</b> {selected.device}</div>
              <div><b>Received:</b> {new Date(selected.created_at).toLocaleString()}</div>
            </div>
            <p className="msg-detail-text">{selected.message}</p>
            <a
              className="btn-save"
              style={{ display: "inline-block", textDecoration: "none", marginTop: 16 }}
              href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: " + (selected.subject || "your message"))}`}
            >
              <i className="fa-solid fa-reply"></i> Reply by Email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
