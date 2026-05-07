import axios from "axios";

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 120000,
});

httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);
