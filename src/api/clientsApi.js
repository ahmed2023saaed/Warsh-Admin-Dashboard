import apiClient from './apiClient';
import { callApi } from './apiRequest';

// Status values for GET /Admin/clients. Swagger only lists 0-3 without names;
// these follow the order of `counts` in the response (all, active, suspended, new).
// 'all' sends no Status at all.
const STATUS_FILTERS = {
  active: 1,
  suspended: 2,
  new: 3,
};

// Returns { items, page, pageSize, totalCount, totalPages, counts: { all, active, suspended, new } }
export async function getClients({ page = 1, pageSize = 10, search = '', status = 'all' } = {}) {
  const data = await callApi(
    'Get clients',
    () =>
      apiClient.get('/Admin/clients', {
        params: {
          Page: page,
          PageSize: pageSize,
          Search: search || undefined,
          Status: STATUS_FILTERS[status],
        },
      }),
    'Failed to load customers'
  );

  return data.data;
}

// One customer with everything the details drawer shows (cars etc.)
export async function getClientById(id) {
  const data = await callApi(
    'Get client',
    () => apiClient.get(`/Admin/clients/${id}`),
    'Failed to load customer'
  );

  return data.data;
}

// Activity rows → what the history table reads: { id, type, description, date }
function normalizeActivity(activity, index) {
  return {
    ...activity,
    id: activity.id ?? activity.activityId ?? index + 1,
    type: String(activity.type ?? activity.activityType ?? activity.action ?? ''),
    description: activity.description ?? activity.details ?? activity.message ?? '',
    date: activity.date ?? activity.createdAt ?? activity.occurredAt ?? '',
  };
}

// Returns { items, totalCount } — the list may come as data: [...] or data: { items, totalCount }
export async function getClientActivity(id, { page = 1, pageSize = 10 } = {}) {
  const data = await callApi(
    'Get client activity',
    () =>
      apiClient.get(`/Admin/clients/${id}/activity`, {
        params: { ClientId: id, Page: page, PageSize: pageSize },
      }),
    'Failed to load customer activity'
  );

  const result = data.data;
  const rows = Array.isArray(result) ? result : result?.items || [];

  return {
    items: rows.map(normalizeActivity),
    totalCount: result?.totalCount ?? rows.length,
  };
}

export async function suspendClient(id, { reason, durationDays }) {
  return callApi(
    'Suspend client',
    () => apiClient.post(`/Admin/clients/${id}/suspend`, { reason, durationDays }),
    'Failed to suspend customer'
  );
}

export async function activateClient(id) {
  return callApi(
    'Activate client',
    () => apiClient.post(`/Admin/clients/${id}/activate`),
    'Failed to activate customer'
  );
}
