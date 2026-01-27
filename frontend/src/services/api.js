import axios from "axios";

// Vite environment variable (WORKS locally + production)
const API_URL = process.env.REACT_APP_API_URL  || "https://walavideo-backend.azurewebsites.net";

if (!API_URL) {
  throw new Error(
    "REACT_APP_API_URL is not defined. Check your .env file or Azure Static Web App configuration."
  );
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
