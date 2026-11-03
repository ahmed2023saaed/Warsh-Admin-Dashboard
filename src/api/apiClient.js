import axios from 'axios';

const API_URL = import.meta.env.VITE_ADMIN_API;

// The backend has no admin refresh endpoint yet, so the client one is used.
// When POST /Admin/refresh-token exists (same body), change only this line.
const REFRESH_PATH = '/Auth/client/refresh-token';

// Refresh a little before the token actually expires
const EXPIRY_MARGIN_MS = 30 * 1000;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/** A stored value, or null when it's missing or was saved as "undefined"/"null". */
function readStored(key) {
  const value = localStorage.getItem(key);
  return value && value !== 'undefined' && value !== 'null' ? value : null;
}

function isAccessTokenExpired() {
  const expiresAt = Date.parse(readStored('accessTokenExpiresAt') || '');
  return Number.isFinite(expiresAt) && expiresAt - EXPIRY_MARGIN_MS <= Date.now();
}

/** The session can't be refreshed: clear it and send the admin to the login page. */
function endSession() {
  ['accessToken', 'refreshToken', 'accessTokenExpiresAt', 'adminUser', 'adminPermissions'].forEach(
    (key) => localStorage.removeItem(key)
  );

  const lang = window.location.pathname.split('/')[1] === 'ar' ? 'ar' : 'en';
  if (!window.location.pathname.endsWith('/login')) {
    window.location.replace(`/${lang}/login`);
  }
}

// Every request that needs a new token waits for this one refresh
let refreshPromise = null;

/** POST the refresh token once, save the new tokens, and return the new access token. */
function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = readStored('refreshToken');
  if (!refreshToken) return Promise.reject(new Error('No refresh token saved — log in again.'));

  refreshPromise = axios
    .post(
      `${API_URL}${REFRESH_PATH}`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
    )
    .then((response) => {
      const data = response.data;
      if (!data?.isSuccess) throw new Error(data?.message || 'Unable to refresh access token');

      const tokenData = data.data || data;
      if (!tokenData.accessToken) throw new Error('No new access token was returned');

      localStorage.setItem('accessToken', tokenData.accessToken);
      // Some backends rotate the refresh token too
      if (tokenData.refreshToken) localStorage.setItem('refreshToken', tokenData.refreshToken);
      if (tokenData.expiresAt) localStorage.setItem('accessTokenExpiresAt', tokenData.expiresAt);

      return tokenData.accessToken;
    })
    .catch((error) => {
      // e.g. 400 "Invalid token" when the client endpoint doesn't accept admin refresh tokens
      console.error(
        'Token refresh failed:',
        error.response?.status ?? '',
        error.response?.data?.message || error.message
      );
      endSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

const isRefreshRequest = (config) => config?.url?.includes(REFRESH_PATH);

// Add the access token to every request, refreshing first when it has already expired
apiClient.interceptors.request.use(
  async (config) => {
    if (!isRefreshRequest(config) && readStored('refreshToken') && isAccessTokenExpired()) {
      try {
        await refreshAccessToken();
      } catch {
        // Send it anyway; the 401 below ends the session cleanly
      }
    }

    const accessToken = readStored('accessToken');
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// 401 → refresh the token → run the same request again (once)
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest) return Promise.reject(error);

    // Don't retry forever, and don't refresh the refresh request itself
    if (originalRequest._retry || isRefreshRequest(originalRequest)) {
      return Promise.reject(error);
    }

    if (!readStored('refreshToken')) {
      endSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch {
      // Reject with the original 401 so callers show "Unauthorized", not the refresh error
      return Promise.reject(error);
    }
  }
);

export default apiClient;
