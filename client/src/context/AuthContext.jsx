import { createContext, useContext, useState, useCallback } from "react";
import api, { setAccessToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(() => {
    const t = localStorage.getItem("admin_access_token");
    if (t) setAccessToken(t);
    return t;
  });
  const [email, setEmail] = useState(() => localStorage.getItem("admin_email") || "");

  const persistTokens = useCallback((access, refresh, adminEmail) => {
    setAccessTokenState(access);
    setAccessToken(access);
    localStorage.setItem("admin_access_token", access);
    localStorage.setItem("admin_refresh_token", refresh);
    localStorage.setItem("admin_email", adminEmail);
    setEmail(adminEmail);
  }, []);

  const clearTokens = useCallback(() => {
    setAccessTokenState(null);
    setAccessToken(null);
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
  }, []);

  const login = useCallback(
    async (loginEmail, password) => {
      const res = await api.post("/api/auth/login", { email: loginEmail, password });
      persistTokens(res.data.access_token, res.data.refresh_token, loginEmail);
    },
    [persistTokens]
  );

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("admin_refresh_token");
    try {
      if (refreshToken) await api.post("/api/auth/logout", { refresh_token: refreshToken });
    } catch (err) {
      // ignore network errors on logout
    }
    clearTokens();
  }, [clearTokens]);

  const forgotPassword = useCallback(async (targetEmail) => {
    await api.post("/api/auth/forgot-password", { email: targetEmail });
  }, []);

  const resetPassword = useCallback(async (targetEmail, code, newPassword) => {
    await api.post("/api/auth/reset-password", { email: targetEmail, code, new_password: newPassword });
  }, []);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    await api.post("/api/auth/change-password", { old_password: oldPassword, new_password: newPassword });
    clearTokens();
  }, [clearTokens]);

  return (
    <AuthContext.Provider
      value={{
        isAdmin: Boolean(accessToken),
        email,
        login,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
