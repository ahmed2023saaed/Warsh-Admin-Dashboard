/**
 * Settings page: pricing, platform, roles, and service base prices —
 * API_ENDPOINTS.xlsx rows #53–#57, #74–#75 (not live yet). The catalog lists are in catalogApi.js.
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';

/** #53 GET /Admin/settings/pricing → { bookingFee, commissionPercent, monthlySubscription, marketingPackage, freeTrialMonths } */
export async function getPricingSettings() {
  const data = await callApi(
    'Get pricing settings',
    () => apiClient.get('/Admin/settings/pricing'),
    'Failed to load pricing'
  );

  return data.data;
}

/** #54 PUT /Admin/settings/pricing — same fields, all numbers */
export async function updatePricingSettings(pricing) {
  const body = Object.fromEntries(
    [
      'bookingFee',
      'commissionPercent',
      'monthlySubscription',
      'marketingPackage',
      'freeTrialMonths',
    ].map((key) => [key, Number(pricing[key]) || 0])
  );

  const data = await callApi(
    'Update pricing settings',
    () => apiClient.put('/Admin/settings/pricing', body),
    'Failed to save pricing'
  );

  return data.data;
}

/**
 * The page's settingsData.js ids → the API field names, so the Pricing section can keep its list:
 *   toPricingRows(apiPricing) → pricingSettings items with `amount` from the API.
 */
const PRICING_FIELDS = {
  bookingFee: 'bookingFee',
  commission: 'commissionPercent',
  monthlySubscription: 'monthlySubscription',
  marketingPackage: 'marketingPackage',
  freeTrial: 'freeTrialMonths',
};

export function toPricingRows(pricing, rows) {
  return rows.map((row) =>
    PRICING_FIELDS[row.id] && pricing?.[PRICING_FIELDS[row.id]] !== undefined
      ? { ...row, amount: pricing[PRICING_FIELDS[row.id]] }
      : row
  );
}

/** The other way: one edited pricing row → a partial body for updatePricingSettings. */
export function pricingRowToField(row) {
  return { [PRICING_FIELDS[row.id] ?? row.id]: row.amount };
}

/** #55 GET /Admin/settings/platform → { appVersion, maintenanceMode, defaultLanguage, emergencySosEnabled } */
export async function getPlatformSettings() {
  const data = await callApi(
    'Get platform settings',
    () => apiClient.get('/Admin/settings/platform'),
    'Failed to load platform settings'
  );

  return data.data;
}

/** #56 PATCH /Admin/settings/platform — send only the changed field, e.g. { maintenanceMode: true } */
export async function updatePlatformSetting(changes) {
  const allowed = ['maintenanceMode', 'defaultLanguage', 'emergencySosEnabled'];
  const body = Object.fromEntries(Object.entries(changes).filter(([key]) => allowed.includes(key)));

  const data = await callApi(
    'Update platform setting',
    () => apiClient.patch('/Admin/settings/platform', body),
    'Failed to save the setting'
  );

  return data.data;
}

/** #57 GET /Admin/roles → [{ id, key, name, description, usersCount, permissionIds }] */
export async function getAdminRoles() {
  const data = await callApi(
    'Get admin roles',
    () => apiClient.get('/Admin/roles'),
    'Failed to load roles'
  );

  return Array.isArray(data.data) ? data.data : data.data?.items || [];
}

/** #74 GET /Admin/service-prices → [{ serviceCategoryId, minPrice, maxPrice }] */
export async function getServiceBasePrices() {
  const data = await callApi(
    'Get service base prices',
    () => apiClient.get('/Admin/service-prices'),
    'Failed to load the service base prices'
  );

  return Array.isArray(data.data) ? data.data : data.data?.items || [];
}

/** #75 PUT /Admin/service-prices [{ serviceCategoryId, minPrice, maxPrice }] → the saved list */
export async function updateServiceBasePrices(prices) {
  const body = prices.map(({ serviceCategoryId, minPrice, maxPrice }) => ({
    serviceCategoryId: Number(serviceCategoryId),
    minPrice: Number(minPrice) || 0,
    maxPrice: Number(maxPrice) || 0,
  }));

  const data = await callApi(
    'Update service base prices',
    () => apiClient.put('/Admin/service-prices', body),
    'Failed to save the service base prices'
  );

  return Array.isArray(data.data) ? data.data : body;
}
