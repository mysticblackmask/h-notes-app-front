import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // Update to match your Django API URL
});

API.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
