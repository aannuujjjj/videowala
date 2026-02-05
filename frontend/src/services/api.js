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

// Optional: log once in dev
if (process.env.NODE_ENV === "development") {
  console.log("API base URL:", API_URL);
}

export default api;
