import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import api from "../api";

const PortfolioContext = createContext(null);
const CACHE_KEY = "portfolio_content_cache_v1";

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota/storage errors, caching is a nice-to-have
  }
}

export function PortfolioProvider({ children }) {
  // Lazy initializer: readCache() runs ONCE on mount, not on every render.
  const [content, setContent] = useState(() => readCache());
  // Remember whether we had cache at mount time, in a ref so it never
  // changes identity and never re-triggers effects/callbacks.
  const hadCacheOnMount = useRef(content !== null);
  const [loading, setLoading] = useState(!hadCacheOnMount.current);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await api.get("/api/content");
      setContent(res.data);
      writeCache(res.data);
      setError(null);
    } catch (err) {
      if (!hadCacheOnMount.current) {
        setError("Unable to load portfolio content. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent(hadCacheOnMount.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs exactly once on mount — no polling, no loop

  const saveSection = useCallback(
    async (section, payload) => {
      await api.put(`/api/content/${section}`, payload);
      await fetchContent();
    },
    [fetchContent]
  );

  return (
    <PortfolioContext.Provider value={{ content, loading, error, saveSection, refresh: fetchContent }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
