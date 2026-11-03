/**
 * Service Centers page (+ Marketing "featured centers") — API_ENDPOINTS.xlsx rows
 * #16, #19–#22, #44–#45 (not live yet). Approve / reject (#17, #18) are live in serviceCenterApi.js.
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';
import { getList } from './helpers';

/** #16 GET /Admin/workshops/pending → { items: [{ id, name, brands, ownerName, location, submittedAt }], totalCount } */
export function getPendingWorkshops({ page = 1, pageSize = 10 } = {}) {
  return getList(
    'Get pending workshops',
    '/Admin/workshops/pending',
    { page, pageSize },
    'Failed to load pending service centers'
  );
}

/**
 * #19 GET /Admin/workshops — status: active | expiring | expired | suspended
 * → { items: [{ id, name, brands, rating, location, bookingsCount, revenue, balance, status }], totalCount }
 */
export function getWorkshops({ page = 1, pageSize = 10, search = '', status = 'all' } = {}) {
  return getList(
    'Get workshops',
    '/Admin/workshops',
    { page, pageSize, search, status },
    'Failed to load service centers'
  );
}

/** #20 GET /Admin/workshops/{id} — details drawer (owner, address, services, documents...) */
export async function getWorkshopById(id) {
  const data = await callApi(
    'Get workshop',
    () => apiClient.get(`/Admin/workshops/${id}`),
    'Failed to load the service center'
  );

  return data.data;
}

/** #21 POST /Admin/workshops/{id}/suspend { reason, durationDays } → { status, suspendedUntil } */
export async function suspendWorkshop(id, { reason, durationDays }) {
  const data = await callApi(
    'Suspend workshop',
    () => apiClient.post(`/Admin/workshops/${id}/suspend`, { reason, durationDays }),
    'Failed to suspend the service center'
  );

  return data.data;
}

/** #22 POST /Admin/workshops/{id}/activate → { status } */
export async function activateWorkshop(id) {
  const data = await callApi(
    'Activate workshop',
    () => apiClient.post(`/Admin/workshops/${id}/activate`),
    'Failed to activate the service center'
  );

  return data.data;
}

/** #44 GET /Admin/workshops/featured?search → [{ id, name, featured }] */
export async function getFeaturedWorkshops({ search = '' } = {}) {
  const data = await callApi(
    'Get featured workshops',
    () => apiClient.get('/Admin/workshops/featured', { params: { search: search || undefined } }),
    'Failed to load featured service centers'
  );

  return Array.isArray(data.data) ? data.data : data.data?.items || [];
}

/** #45 PUT /Admin/workshops/{id}/featured { featured } → { id, featured } */
export async function setWorkshopFeatured(id, featured) {
  const data = await callApi(
    'Set workshop featured',
    () => apiClient.put(`/Admin/workshops/${id}/featured`, { featured: Boolean(featured) }),
    'Failed to update the featured service center'
  );

  return data.data;
}
