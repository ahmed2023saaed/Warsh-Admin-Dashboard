/**
 * Bookings page (+ Dashboard "Recent Bookings") — API_ENDPOINTS.xlsx rows #23–#26 (not live yet).
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';
import { downloadFile, getList, listParams } from './helpers';

/**
 * #23 GET /Admin/bookings — status: pending | active | completed | cancelled
 * → { items: [{ id, client, workshop, car, services, price, fee, commission, paymentMethod,
 *     status, scheduledAt, createdAt }], totalCount, counts: { all, pending, active, completed, cancelled } }
 */
export function getBookings({
  page = 1,
  pageSize = 10,
  status = 'all',
  search = '',
  workshopId,
  clientId,
  from,
  to,
} = {}) {
  return getList(
    'Get bookings',
    '/Admin/bookings',
    { page, pageSize, status, search, workshopId, clientId, from, to },
    'Failed to load bookings'
  );
}

/** #24 GET /Admin/bookings/{id} — same fields as a list item */
export async function getBookingById(id) {
  const data = await callApi(
    'Get booking',
    () => apiClient.get(`/Admin/bookings/${id}`),
    'Failed to load the booking'
  );

  return data.data;
}

/**
 * #25 POST /Admin/bookings/{id}/cancel
 * { reason, cancelledBy: 'client' | 'workshop', refundToClient, refundToWorkshop } (refunds in EGP, nullable)
 */
export async function cancelBooking(id, { reason, cancelledBy, refundToClient, refundToWorkshop }) {
  // Form inputs give strings: "50" → 50, "" / missing → null
  const toAmount = (value) => (value === '' || value == null ? null : Number(value));

  const data = await callApi(
    'Cancel booking',
    () =>
      apiClient.post(`/Admin/bookings/${id}/cancel`, {
        reason,
        cancelledBy,
        refundToClient: toAmount(refundToClient),
        refundToWorkshop: toAmount(refundToWorkshop),
      }),
    'Failed to cancel the booking'
  );

  return data.data;
}

/** #26 GET /Admin/bookings/export — same filters as getBookings + format: xlsx | csv. Downloads the file. */
export function exportBookings({ format = 'xlsx', ...filters } = {}) {
  // The export has no paging
  const params = listParams(filters);
  delete params.page;
  delete params.pageSize;

  return downloadFile(
    'Export bookings',
    '/Admin/bookings/export',
    { ...params, format },
    `bookings.${format}`,
    'Failed to export bookings'
  );
}
