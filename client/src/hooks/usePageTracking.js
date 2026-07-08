import { useEffect } from "react";
import api from "../services/api";

export default function usePageTracking() {
  useEffect(() => {
    api
      .post("/api/analytics/track", {
        path: window.location.pathname || "/",
        referrer: document.referrer || "",
      })
      .catch(() => {});
  }, []);
}
