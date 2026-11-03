/**
 * Payments page — API_ENDPOINTS.xlsx rows #27–#33 (not live yet).
 * The five tabs share one list shape, so they share one function: getPayments(tab, filters).
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';
import { downloadFile, getList, listParams } from './helpers';

/** The Payments tabs and their path segment, e.g. PAYMENT_TABS.bookingFees → 'booking-fees'. */
export const PAYMENT_TABS = {
  bookingFees: 'booking-fees', // #28 status: paid | pending | refunded | failed
  subscriptions: 'subscriptions', // #29 status: paid | pending | failed | expired | cancelled
  marketing: 'marketing', // #30 status: active | pending | completed | failed | cancelled
  commissions: 'commissions', // #31 status: paid | pending | overdue
  refunds: 'refunds', // #32 status: completed | processing | pending | rejected
};

function tabPath(tab) {
  const segment = PAYMENT_TABS[tab] ?? tab;
  if (!Object.values(PAYMENT_TABS).includes(segment)) {
    throw new Error(`Unknown payments tab "${tab}"`);
  }
  return segment;
}

/**
 * #27 GET /Admin/payments/summary — the 5 stat cards
 * → { todaysIncome: { amount, changePercent }, monthlyIncome: { amount, changePercent },
 *     pendingPayments: { amount, invoicesCount }, paidCommission: { amount },
 *     outstandingCommission: { amount, workshopsCount } }
 */
export async function getPaymentsSummary() {
  const data = await callApi(
    'Get payments summary',
    () => apiClient.get('/Admin/payments/summary'),
    'Failed to load the payments summary'
  );

  return data.data;
}

/** #28–#32 GET /Admin/payments/{tab} → { items, totalCount } — see PAYMENT_TABS for the item fields */
export function getPayments(
  tab,
  { page = 1, pageSize = 10, status = 'all', from, to, search = '' } = {}
) {
  return getList(
    `Get payments (${tab})`,
    `/Admin/payments/${tabPath(tab)}`,
    { page, pageSize, status, from, to, search },
    'Failed to load payments'
  );
}

/** #33 GET /Admin/payments/{tab}/export — format: xlsx | pdf + the tab's filters. Downloads the file. */
export function exportPayments(tab, { format = 'xlsx', ...filters } = {}) {
  const segment = tabPath(tab);
  const params = listParams(filters);
  delete params.page;
  delete params.pageSize;

  return downloadFile(
    `Export payments (${tab})`,
    `/Admin/payments/${segment}/export`,
    { ...params, format },
    `${segment}.${format}`,
    'Failed to export payments'
  );
}
