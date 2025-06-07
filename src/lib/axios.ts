import axios from "axios";
const API_URL = "http://localhost:2346/api/v1";
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Important: Allow credentials to be sent with requests
  withCredentials: true,
});

// Response interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(error.response?.status);

      try {
        // Call refresh token endpoint - no need to send refresh token as it's in cookies
        await axios.post(
          `${API_URL}/auth/tokens`,
          {},
          { withCredentials: true }
        );

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
