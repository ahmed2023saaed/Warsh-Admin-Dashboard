/**
 * Admin Users page — API_ENDPOINTS.xlsx rows #76–#77, #80–#83 (not live yet).
 * Creating users (#78, #79) is live in ../addEmployee.js.
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';
import { getList } from './helpers';

/**
 * #76 GET /Admin/users — role, status: active | inactive
 * → { items: [{ id, fullName, email, role, status, lastActiveAt, isProtected, createdAt }], totalCount }
 */
export function getAdminUsers({
  page = 1,
  pageSize = 10,
  search = '',
  role = 'all',
  status = 'all',
} = {}) {
  return getList(
    'Get admin users',
    '/Admin/users',
    { page, pageSize, search, role, status },
    'Failed to load admin users'
  );
}

/** #77 GET /Admin/users/summary → { totalUsers, admins, customRoles, activeUsers } */
export async function getAdminUsersSummary() {
  const data = await callApi(
    'Get admin users summary',
    () => apiClient.get('/Admin/users/summary'),
    'Failed to load the admin users summary'
  );

  return data.data;
}

/** #80 GET /Admin/users/{id} → { id, fullName, email, phoneNumber, nationalId, role, status, permissionIds, ... } */
export async function getAdminUserById(id) {
  const data = await callApi(
    'Get admin user',
    () => apiClient.get(`/Admin/users/${id}`),
    'Failed to load the user'
  );

  return data.data;
}

/** #81 PUT /Admin/users/{id}/role { role } → { id, role } */
export async function changeAdminUserRole(id, role) {
  const data = await callApi(
    'Change admin user role',
    () => apiClient.put(`/Admin/users/${id}/role`, { role }),
    "Failed to change the user's role"
  );

  return data.data;
}

/** #82 PUT /Admin/users/{id}/permissions { permissionIds } → { id, permissionIds } */
export async function setAdminUserPermissions(id, permissionIds) {
  const data = await callApi(
    'Set admin user permissions',
    () =>
      apiClient.put(`/Admin/users/${id}/permissions`, {
        permissionIds: permissionIds.map(Number),
      }),
    "Failed to save the user's permissions"
  );

  return data.data;
}

/** #83 PATCH /Admin/users/{id}/status { status: 'active' | 'inactive' } → { id, status } */
export async function setAdminUserStatus(id, status) {
  const data = await callApi(
    'Set admin user status',
    () => apiClient.patch(`/Admin/users/${id}/status`, { status }),
    "Failed to change the user's status"
  );

  return data.data;
}
