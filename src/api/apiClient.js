import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Prevent multiple requests from refreshing the token at the same time
let refreshPromise = null;

// Add access token to every request
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle expired access token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // No response or not unauthorized
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry the same request forever
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh the refresh-token request itself
    if (originalRequest.url?.includes('/Auth/client/refresh-token')) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');

    // No refresh token means the user has to log in again
    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // If another request is already refreshing,
      // wait for that refresh instead of sending another one.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${import.meta.env.VITE_ADMIN_API}/Auth/client/refresh-token`,
            {
              refreshToken,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          )
          .then((response) => {
            const data = response.data;

            if (!data.isSuccess) {
              throw new Error(data.message || 'Unable to refresh access token');
            }

            // Support the same response structure as your login
            const tokenData = data.data || data;

            const newAccessToken = tokenData.accessToken;
            const newRefreshToken = tokenData.refreshToken;
            const newExpiresAt = tokenData.expiresAt;

            if (!newAccessToken) {
              throw new Error('No new access token was returned');
            }

            // Save the new access token
            localStorage.setItem('accessToken', newAccessToken);

            // Some backends rotate the refresh token too
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            if (newExpiresAt) {
              localStorage.setItem('accessTokenExpiresAt', newExpiresAt);
            }

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      // Put the new token on the failed request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Try the original request again
      return apiClient(originalRequest);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);

      // Refresh token is no longer usable
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessTokenExpiresAt');
      localStorage.removeItem('adminUser');

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
