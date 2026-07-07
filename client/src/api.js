import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

let accessToken = localStorage.getItem("admin_access_token") || null;
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token;
}

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("admin_refresh_token");
  if (!refreshToken) throw new Error("No refresh token");
  const res = await axios.post(`${API_URL}/api/auth/refresh`, { refresh_token: refreshToken });
  accessToken = res.data.access_token;
  localStorage.setItem("admin_access_token", accessToken);
  return accessToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthEndpoint = original?.url?.includes("/api/auth/");
    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        if (!refreshPromise) refreshPromise = refreshAccessToken().finally(() => (refreshPromise = null));
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshErr) {
        accessToken = null;
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
