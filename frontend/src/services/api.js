import axios from "axios";

// CRA-safe API base URL
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://walavideo-backend.azurewebsites.net";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 🔒 ATTACH AUTH HEADERS TO EVERY REQUEST
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const deviceId = localStorage.getItem("deviceId");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }

    if (deviceId) {
      config.headers["x-device-id"] = deviceId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (
        status === 401 &&
        data?.message &&
        data.message.includes('Logged out')
      ) {
        // 🔥 FORCE LOGOUT
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Optional: clear deviceId ONLY if you want new device identity
        // localStorage.removeItem('deviceId');

        // Redirect to login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


// Optional: log once in dev
if (process.env.NODE_ENV === "development") {
  console.log("API base URL:", API_URL);
}

export default api;
