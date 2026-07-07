import { useEffect } from "react";
import api from "../api";

export default function usePageTracking() {
  useEffect(() => {
    api.post("/api/analytics/track", { path: window.location.pathname || "/" }).catch(() => {});
  }, []);
}
