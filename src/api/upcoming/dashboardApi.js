/**
 * Dashboard page — API_ENDPOINTS.xlsx rows #7–#10 (not live yet).
 * The page's Recent Bookings and Pending Approvals reuse
 * getBookings (bookingsApi.js, #23) and getPendingWorkshops (workshopsApi.js, #16).
 *
 * To turn the mapped data into what Dashboard.jsx shows, see dashboardMappers.js,
 * or use useDashboardData.js, which does both.
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';

/**
 * #7 GET /Admin/dashboard/stats — the 8 stat cards.
 * Returns { monthlyRevenue: { amount, changePercent }, carsServicedToday: { count, changeVsYesterday },
 *   outstandingCommission: { amount, workshopsCount }, expiredSubscriptions: { count },
 *   averageRating: { value, changeThisMonth }, openEmergencyRequests: { count, longestWaitMinutes },
 *   newCustomers: { count, changePercent }, newWorkshops: { count, pendingCount } }
 */
export async function getDashboardStats() {
  const data = await callApi(
    'Get dashboard stats',
    () => apiClient.get('/Admin/dashboard/stats'),
    'Failed to load the dashboard numbers'
  );

  return data.data;
}

/** #8 GET /Admin/dashboard/revenue?months=12 → [{ month: "2026-01", amount }] */
export async function getDashboardRevenue({ months = 12 } = {}) {
  const data = await callApi(
    'Get dashboard revenue',
    () => apiClient.get('/Admin/dashboard/revenue', { params: { months } }),
    'Failed to load the revenue chart'
  );

  return Array.isArray(data.data) ? data.data : data.data?.items || [];
}

/** #9 GET /Admin/dashboard/daily-bookings?from&to → [{ date: "2026-10-11", count }] */
export async function getDashboardDailyBookings({ from, to } = {}) {
  const data = await callApi(
    'Get daily bookings',
    () => apiClient.get('/Admin/dashboard/daily-bookings', { params: { from, to } }),
    'Failed to load the daily bookings chart'
  );

  return Array.isArray(data.data) ? data.data : data.data?.items || [];
}

/** #10 GET /Admin/dashboard/top-workshops?limit=3 → [{ id, name, revenue }] */
export async function getTopWorkshops({ limit = 3 } = {}) {
  const data = await callApi(
    'Get top workshops',
    () => apiClient.get('/Admin/dashboard/top-workshops', { params: { limit } }),
    'Failed to load the top service centers'
  );

  return Array.isArray(data.data) ? data.data : data.data?.items || [];
}

/** The current week, Sunday → Saturday, as { from, to } dates for #9. */
export function currentWeekRange(today = new Date()) {
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  // Local date (not toISOString, which is UTC and can be a day off at night)
  const toDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return { from: toDate(start), to: toDate(end) };
}
