import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unread_count);
    } catch (err) {
      // silently ignore, dashboard still usable without notifications
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = useCallback(async () => {
    await api.put("/api/notifications/read-all");
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = useCallback(
    async (id) => {
      await api.put(`/api/notifications/${id}/read`);
      fetchNotifications();
    },
    [fetchNotifications]
  );

  return { notifications, unreadCount, markAllRead, markRead, refresh: fetchNotifications };
}
