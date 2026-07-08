import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

export default function useDashboard(range = "30d") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async (r) => {
    setLoading(true);
    try {
      const res = await api.get("/api/analytics/dashboard", { params: { range: r } });
      setData(res.data);
    } catch (err) {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(range);
    const interval = setInterval(() => fetchDashboard(range), 45000);
    return () => clearInterval(interval);
  }, [range, fetchDashboard]);

  return { data, loading, refresh: () => fetchDashboard(range) };
}
