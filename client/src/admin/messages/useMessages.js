import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

export default function useMessages() {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  const fetchMessages = useCallback(async (s = status, query = q) => {
    setLoading(true);
    try {
      const res = await api.get("/api/messages", { params: { status: s, q: query } });
      setMessages(res.data.messages);
      setTotal(res.data.total);
      setUnread(res.data.unread);
    } catch (err) {
      // keep previous state on failure
    } finally {
      setLoading(false);
    }
  }, [status, q]);

  useEffect(() => {
    fetchMessages(status, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q]);

  const markRead = useCallback(async (id) => {
    await api.put(`/api/messages/${id}/read`);
    fetchMessages();
  }, [fetchMessages]);

  const markUnread = useCallback(async (id) => {
    await api.put(`/api/messages/${id}/unread`);
    fetchMessages();
  }, [fetchMessages]);

  const remove = useCallback(async (id) => {
    await api.delete(`/api/messages/${id}`);
    fetchMessages();
  }, [fetchMessages]);

  return { messages, total, unread, loading, status, setStatus, q, setQ, markRead, markUnread, remove, refresh: fetchMessages };
}
