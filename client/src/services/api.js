import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

let accessToken = localStorage.getItem("admin_access_token") || null;

let refreshPromise = null;

export const setAccessToken = (token) => {
	accessToken = token;
};

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000,
});

api.interceptors.request.use(
	(config) => {
		if (accessToken && !config.headers.Authorization) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

const refreshAccessToken = async () => {
	const refreshToken = localStorage.getItem("admin_refresh_token");

	if (!refreshToken) {
		throw new Error("No refresh token");
	}

	const { data } = await axios.post(`${API_URL}/api/auth/refresh-full`, {
		refresh_token: refreshToken,
	});

	accessToken = data.access_token;

	localStorage.setItem("admin_access_token", data.access_token);

	localStorage.setItem("admin_refresh_token", data.refresh_token);

	return data.access_token;
};

api.interceptors.response.use(
	(response) => response,

	async (error) => {
		const originalRequest = error.config;

		const isAuthRequest = originalRequest?.url?.includes("/api/auth/");

		if (
			error.response?.status === 401 &&
			!originalRequest?._retry &&
			!isAuthRequest
		) {
			originalRequest._retry = true;

			try {
				if (!refreshPromise) {
					refreshPromise = refreshAccessToken().finally(() => {
						refreshPromise = null;
					});
				}

				const token = await refreshPromise;

				originalRequest.headers.Authorization = `Bearer ${token}`;

				return api(originalRequest);
			} catch {
				accessToken = null;

				localStorage.removeItem("admin_access_token");
				localStorage.removeItem("admin_refresh_token");

				window.location.replace("/admin/login");

				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
