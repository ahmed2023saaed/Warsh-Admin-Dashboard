/**
 * Auth & admin — API_ENDPOINTS.xlsx rows #3–#4 (not live yet).
 * Login, permissions, and the token refresh are live in ../authApi.js and ../apiClient.js.
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';
import { logoutAdmin } from '../authApi';

/**
 * #3 POST /Admin/logout { refreshToken } — revokes the refresh token on the server, then clears
 * the local session. The local session is cleared even when the request fails, so the
 * Logout button always logs out.
 */
export async function logoutAdminOnServer() {
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    if (refreshToken) {
      await callApi(
        'Admin logout',
        () => apiClient.post('/Admin/logout', { refreshToken }),
        'Failed to log out on the server'
      );
    }
  } finally {
    logoutAdmin();
  }
}

/** #4 GET /Admin/me → { id, name, email, role, permissionIds } (for the Topbar name and role) */
export async function getCurrentAdmin() {
  const data = await callApi(
    'Get current admin',
    () => apiClient.get('/Admin/me'),
    'Failed to load your account'
  );

  return data.data;
}
