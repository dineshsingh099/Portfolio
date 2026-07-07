import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api";

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/content");
      setContent(res.data);
      setError(null);
    } catch (err) {
      setError("Unable to load portfolio content. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

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
