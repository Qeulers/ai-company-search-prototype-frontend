import axios from "axios";

const POLESTAR_API_BASE =
  import.meta.env.VITE_POLESTAR_API_BASE_URL ||
  "https://api.polestar-production.com";

// Event emitter for auth state changes
const authEventListeners = new Set();

export const onAuthEvent = (callback) => {
  authEventListeners.add(callback);
  return () => authEventListeners.delete(callback);
};

const emitAuthEvent = (event) => {
  authEventListeners.forEach((callback) => callback(event));
};

const polestarApi = axios.create({
  baseURL: POLESTAR_API_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => localStorage.getItem("polestar_access_token");
const getRefreshToken = () => localStorage.getItem("polestar_refresh_token");

const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("polestar_access_token", accessToken);
  localStorage.setItem("polestar_refresh_token", refreshToken);
};

const clearAuth = () => {
  localStorage.removeItem("polestar_access_token");
  localStorage.removeItem("polestar_refresh_token");
  localStorage.removeItem("polestar_user_id");
  localStorage.removeItem("polestar_email");
  localStorage.removeItem("polestar_first_name");
  localStorage.removeItem("polestar_last_name");
  localStorage.removeItem("polestar_account_id");
  localStorage.removeItem("user_persona");
};

const isTokenExpiredError = (error) => {
  if (error.response?.status === 401) return true;
  // Also check response body for token expiration indicators
  const data = error.response?.data;
  if (data?.status === 401) return true;
  if (data?.title?.toLowerCase().includes("expired")) return true;
  if (data?.detail?.toLowerCase().includes("expired")) return true;
  return false;
};

polestarApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

polestarApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (isTokenExpiredError(error) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return polestarApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuth();
        emitAuthEvent({ type: "session_expired", reason: "no_refresh_token" });
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${POLESTAR_API_BASE}/account/v2/auth/refresh-token`,
          { refresh_token: refreshToken },
        );

        const { access_token, refresh_token } = response.data;
        setTokens(access_token, refresh_token);
        emitAuthEvent({ type: "token_refreshed" });

        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return polestarApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        emitAuthEvent({ type: "session_expired", reason: "refresh_failed" });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const signin = async (email, password) => {
  const response = await axios.post(
    `${POLESTAR_API_BASE}/account/v2/auth/signin`,
    {
      email,
      password,
    },
  );

  const data = response.data;

  localStorage.setItem("polestar_access_token", data.access_token);
  localStorage.setItem("polestar_refresh_token", data.refresh_token);
  localStorage.setItem("polestar_user_id", data.user_id);
  localStorage.setItem("polestar_email", data.email);
  localStorage.setItem("polestar_first_name", data.first_name);
  localStorage.setItem("polestar_last_name", data.last_name);
  localStorage.setItem("polestar_account_id", data.account_id);

  return data;
};

export const logout = () => {
  clearAuth();
};

const isAccessTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    // Consider expired if less than 5 minutes remaining
    return payload.exp * 1000 < Date.now() + 5 * 60 * 1000;
  } catch {
    return true;
  }
};

export const validateSession = async () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return false;
  }

  // Skip proactive refresh if the access token is still valid
  if (!isAccessTokenExpired(accessToken)) {
    return true;
  }

  try {
    const response = await axios.post(
      `${POLESTAR_API_BASE}/account/v2/auth/refresh-token`,
      { refresh_token: refreshToken },
    );

    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    emitAuthEvent({ type: "token_refreshed" });
    return true;
  } catch (error) {
    clearAuth();
    emitAuthEvent({ type: "session_expired", reason: "validation_failed" });
    return false;
  }
};

export const searchVessels = async (params) => {
  const response = await polestarApi.get("/vessel-insights/v1/vessel-search", {
    params,
  });
  return response.data;
};

export const getVesselCharacteristics = async (imo) => {
  const response = await polestarApi.get(
    `/vessel-insights/v1/vessel-characteristics/${imo}`,
  );
  return response.data;
};

export default polestarApi;
