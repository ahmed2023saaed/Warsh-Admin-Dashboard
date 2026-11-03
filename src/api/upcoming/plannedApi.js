/**
 * Planned pages that aren't built yet — API_ENDPOINTS.xlsx rows #84–#92.
 * The response items aren't defined in the sheet yet, so these return the raw items.
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';
import { getList } from './helpers';

/* ---------- Emergency requests (#84–#86) ---------- */

/** #84 GET /Admin/emergency-requests */
export function getEmergencyRequests({ page = 1, pageSize = 10, status = 'all' } = {}) {
  return getList(
    'Get emergency requests',
    '/Admin/emergency-requests',
    { page, pageSize, status },
    'Failed to load emergency requests'
  );
}

/** #85 POST /Admin/emergency-requests/{id}/assign { workshopId } */
export function assignEmergencyRequest(id, workshopId) {
  return callApi(
    'Assign emergency request',
    () =>
      apiClient.post(`/Admin/emergency-requests/${id}/assign`, { workshopId: Number(workshopId) }),
    'Failed to assign the emergency request'
  );
}

/** #86 POST /Admin/emergency-requests/{id}/resolve { notes } */
export function resolveEmergencyRequest(id, notes = '') {
  return callApi(
    'Resolve emergency request',
    () => apiClient.post(`/Admin/emergency-requests/${id}/resolve`, { notes }),
    'Failed to resolve the emergency request'
  );
}

/* ---------- Notifications (#87–#88) ---------- */

/** #87 GET /Admin/notifications */
export function getAdminNotifications({ page = 1, pageSize = 10 } = {}) {
  return getList(
    'Get notifications',
    '/Admin/notifications',
    { page, pageSize },
    'Failed to load notifications'
  );
}

/** #88 PATCH /Admin/notifications/{id}/read */
export function markNotificationRead(id) {
  return callApi(
    'Mark notification read',
    () => apiClient.patch(`/Admin/notifications/${id}/read`),
    'Failed to mark the notification as read'
  );
}

/* ---------- Reports (#89) ---------- */

/** #89 GET /Admin/reports/{type} — returns the report data (use helpers.downloadFile for a file format) */
export async function getReport(type, { from, to, format } = {}) {
  const data = await callApi(
    `Get report (${type})`,
    () => apiClient.get(`/Admin/reports/${type}`, { params: { from, to, format } }),
    'Failed to load the report'
  );

  return data.data;
}

/* ---------- Subscriptions (#90) ---------- */

/** #90 GET /Admin/subscriptions */
export function getSubscriptions({ page = 1, pageSize = 10, status = 'all' } = {}) {
  return getList(
    'Get subscriptions',
    '/Admin/subscriptions',
    { page, pageSize, status },
    'Failed to load subscriptions'
  );
}

/* ---------- Complaints (#91–#92) ---------- */

/** #91 GET /Admin/complaints */
export function getComplaints({ page = 1, pageSize = 10, status = 'all' } = {}) {
  return getList(
    'Get complaints',
    '/Admin/complaints',
    { page, pageSize, status },
    'Failed to load complaints'
  );
}

/** #92 PATCH /Admin/complaints/{id}/status { status } */
export function setComplaintStatus(id, status) {
  return callApi(
    'Set complaint status',
    () => apiClient.patch(`/Admin/complaints/${id}/status`, { status }),
    "Failed to change the complaint's status"
  );
}
