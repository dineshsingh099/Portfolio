import { useState, useRef, useEffect } from "react";
import useNotifications from "./hooks/useNotifications";

const ICONS = {
  contact: "fa-solid fa-envelope",
  login: "fa-solid fa-right-to-bracket",
  security: "fa-solid fa-shield-halved",
};

export default function NotificationsBell() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="notif-wrapper" ref={ref}>
      <button className="notif-bell" onClick={() => setOpen((v) => !v)}>
        <i className="fa-solid fa-bell"></i>
        {unreadCount > 0 && <span className="notif-dot">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="notif-mark-all">
                Mark all read
              </button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length === 0 && <div className="notif-empty">No notifications yet</div>}
            {notifications.map((n) => (
              <div key={n.id} className={`notif-item${n.read ? "" : " unread"}`} onClick={() => !n.read && markRead(n.id)}>
                <i className={ICONS[n.type] || "fa-solid fa-circle-info"}></i>
                <div>
                  <p>{n.message}</p>
                  <span>{new Date(n.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
