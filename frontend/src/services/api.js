import axios from 'axios';

const API_URL = "https://walavideo-backend.azurewebsites.net";

if (!API_URL) {
  throw new Error(
    "REACT_APP_API_URL is not defined. Check Azure Static Web App Configuration."
  );
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
