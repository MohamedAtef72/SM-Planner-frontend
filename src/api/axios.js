import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://sm-planner.runasp.net/api' // Your API's base URL
});

// === Request Interceptor ===
// This runs BEFORE each request is sent
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Add the authorization header to every request
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === Response Interceptor ===
// This runs AFTER a response is received
api.interceptors.response.use(
  // If the response is successful, just return it
  (response) => {
    return response;
  },
  // If there's an error, handle it
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 (Unauthorized) and we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've tried to refresh

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          // If no refresh token, logout and redirect
          // (You might want to create a shared logout function for this)
          sessionStorage.clear();
          Cookies.remove('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Call your refresh token endpoint
        const response = await axios.post('https://sm-planner.runasp.net/api/Account/Refresh', { refreshToken });
        const { token: newAccessToken } = response.data;

        // Store the new access token
        sessionStorage.setItem('token', newAccessToken);

        // Update the authorization header for the original request
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Retry the original request with the new token
        return api(originalRequest);

      } catch (refreshError) {
        // If the refresh token is also invalid, logout the user
        sessionStorage.clear();
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just pass them on
    return Promise.reject(error);
  }
);

export default api;