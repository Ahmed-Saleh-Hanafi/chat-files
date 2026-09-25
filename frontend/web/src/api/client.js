import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const DEBUG = import.meta.env.VITE_API_DEBUG === "true";

const ACCESS_TOKEN_KEY = "chatfiles_access_token";
const REFRESH_TOKEN_KEY = "chatfiles_refresh_token";

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request.
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug("[API request]", config.method?.toUpperCase(), config.url, config.data);
  }
  return config;
});

// Session-expiry handling: try a silent refresh once, otherwise force logout.
let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.debug("[API response]", response.config.url, response.status);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry && tokenStorage.getRefreshToken()) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        tokenStorage.setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        flushQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        tokenStorage.clear();
        window.dispatchEvent(new CustomEvent("chatfiles:session-expired"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

// Turns an axios error into a predictable shape the UI can render safely
// (never surfaces raw stack traces / DB errors to the user).
export function normalizeError(error) {
  const status = error.response?.status;
  const data = error.response?.data;
  const message =
    (typeof data === "object" && (data?.message || data?.detail)) ||
    (status ? `Request failed (${status}).` : "Network error. Please check your connection.");

  return {
    status,
    message,
    fieldErrors: data?.errors || null,
    raw: DEBUG ? error : undefined,
  };
}

export default apiClient;
