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
  timeout: 10000, // prevents hanging requests
});

// Optional: log once in dev (helps debugging, never crashes app)
if (process.env.NODE_ENV === "development") {
  console.log("API base URL:", API_URL);
}

export default api;
