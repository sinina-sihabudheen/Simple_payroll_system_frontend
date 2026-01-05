// src/axiosInstance.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired and not already retried
    if (
      error.response?.status === 401 &&
      error.response.data?.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      try {
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh,
        });
        const newAccess = response.data.access;

        localStorage.setItem("access", newAccess);

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      } catch {
        console.error("Refresh token expired. Logging out...");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
